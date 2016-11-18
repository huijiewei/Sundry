<?php
/**
 * Created by CotEditor.
 * User: huijiewei
 * Date: 5/29/15
 * Time: 16:50
 */

$config = require('deploy.conf.php');

function logmsg($log, $msg = '')
{
    $handle = fopen(dirname(__FILE__) . '/' . $log . date("md") . '.log.txt', 'a');
    fwrite($handle, date("H:i:s") . ' - ' . $msg . PHP_EOL);
    fclose($handle);
}

function gitpull($rep, $ref, $log)
{
    $usr = $rep['usr'];
    $pwd = $rep['pwd'];
    $url = $rep['url'];
    $https = $rep['https'];

    if (!isset($rep[$ref])) {
        logmsg($log, "ref $ref is not exists");
        exit;
    }

    $dir = $rep[$ref]['dir'];
    $bin = $rep[$ref]['bin'];
    $env = $rep[$ref]['env'];

    $cd = chdir($dir);

    if (!$cd) {
        logmsg($log, 'error chdir to' . $dir);
        exit;
    }

    if (!file_exists($dir . DIRECTORY_SEPARATOR . ".git")) {
        $gt = shell_exec('git init');

    } else {
        $gr = shell_exec('git reset --hard');
    }

    $auth = rawurlencode($usr) . ':' . rawurlencode($pwd) . '@';

    if ($https) {
        $url = str_replace("https://", "https://$auth", $url);
    } else {
        $url = str_replace("http://", "http://$auth", $url);
    }
    
    $result = shell_exec("git pull -f $url $ref 2>&1");

    logmsg($log, $result);
    
    if(strpos($result, 'environments/') !== false) {
        $er =  shell_exec('./init --env='.$env.' --overwrite=All');        
	    logmsg($log,'Init environment:'. $er);
    }

    $result = shell_exec($bin);

    logmsg($log, $result);
}

$rep = isset($_GET['p']) ? trim($_GET['p']) : '';

if (strlen($rep) && isset($config[$rep])) {
    $log = $rep;
    $rep_cfg = $config[$rep];

    // 测试
    if (isset($_GET['t']) && isset($_GET['ref'])) {
        gitpull($rep_cfg, $_GET['ref'], $log);
        exit;
    }

    $raw = file_get_contents('php://input');

    if (!strlen($raw)) {
        logmsg($log, 'error get post data');
        exit;
    }

    $json = json_decode($raw, true);

    if ($json == null) {
        logmsg($log, 'error parsing json');
        exit;
    }

    if (!isset($json[$rep_cfg['token_name']]) || $json[$rep_cfg['token_name']] != $rep_cfg['token']) {
        logmsg($log, 'error token');
        exit;
    }

    if (isset($json['ref'])) {
        gitpull($rep_cfg, str_replace($rep_cfg['ref_prefix'], '', $json['ref']), $log);
    }
}

