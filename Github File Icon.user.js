// ==UserScript==
// @name         Github File Icon
// @namespace    https://blog.huijiewei.com/
// @version      0.2
// @description  Change Github file icon much better.
// @author       Huijie Wei
// @match        *://*.github.com/*
// @resource deviconsCss https://cdn.bootcss.com/devicons/1.8.0/css/devicons.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

var deviconsCss = GM_getResourceText ("deviconsCss");

GM_addStyle(deviconsCss);

GM_addStyle('@font-face{font-family:devicons;src:url(https://cdn.bootcss.com/devicons/1.8.0/fonts/devicons.eot?xqxft6);src:url(https://cdn.bootcss.com/devicons/1.8.0/fonts/devicons.eot?#iefixxqxft6) format("embedded-opentype"),url(https://cdn.bootcss.com/devicons/1.8.0/fonts/devicons.woff?xqxft6) format("woff"),url(https://cdn.bootcss.com/devicons/1.8.0/fonts/devicons.ttf?xqxft6) format("truetype"),url(https://cdn.bootcss.com/devicons/1.8.0/fonts/devicons.svg?xqxft6#devicons) format("svg");');

GM_addStyle("\
table.files td.icon { \
font-size: 18px; \
} \
\
.devicons { \
font-family: devicons; \
margin-left: -2px; \
margin-top: 1px; \
margin-bottom: -1px; \
speak: none; \
font-style: normal;\
font-weight: 400;\
font-variant: normal;\
text-transform: none;\
line-height: 1;\
-webkit-font-smoothing: antialiased;\
-moz-osx-font-smoothing: grayscale\
}\
");

var fileIconHtmlList = {
    '.html': '<i class="devicons devicons-html5"></i>',
    '.css': '<i class="devicons devicons-css3_full"></i>',
    '.sass': '<i class="devicons devicons-sass"></i>',
    '.less': '<i class="devicons devicons-less"></i>',
    '.js': '<i class="devicons devicons-javascript"></i>',
    '.java': '<i class="devicons devicons-java"></i>',
    '.py': '<i class="devicons devicons-python"></i>',
    '.php': '<i class="devicons devicons-php"></i>',
    '.git': '<i class="devicons devicons-git"></i>',
    '.gitignore': '<i class="devicons devicons-git"></i>',
    '.md': '<i class="devicons devicons-markdown"></i>',
    '.rb': '<i class="devicons devicons-ruby_rough"></i>',
    '.sh': '<i class="devicons devicons-terminal"></i>',
    '.yml': '<i class="devicons devicons-database"></i>',
    '.json': '<i class="devicons devicons-database"></i>',
    '.xml': '<i class="devicons devicons-database"></i>',
    '.plist': '<i class="devicons devicons-apple"></i>',
    '.swift': '<i class="devicons devicons-swift"></i>',
    '.png': '<i class="devicons devicons-photoshop"></i>',
    '.jpg': '<i class="devicons devicons-photoshop"></i>',
    '.gif': '<i class="devicons devicons-photoshop"></i>',
    '.bpm': '<i class="devicons devicons-photoshop"></i>',

    '.svg': '<i class="devicons devicons-snap_svg"></i>',

    '.jshintrc': '<i class="devicons devicons-nodejs_small"></i>',
};

function getFileExt(fileName) {
    var index = fileName.lastIndexOf('.');

    if (index === -1) {
        return '';
    }

    return fileName.substr(index);
}

function getFileIconHtml(fileName) {
    // 优先判断文件名
    if (fileName === 'license') {
        return '<i class="devicons devicons-mitlicence"></i>';
    }

    if (fileName === 'package.json') {
        return '<i class="devicons devicons-npm"></i>';
    }

    // 判断扩展名
    var fileExt = getFileExt(fileName).toLowerCase();

    if (fileIconHtmlList[fileExt]) {
        return fileIconHtmlList[fileExt];
    }
}

function renderFileIcon() {
    console.log('change');
    [].forEach.call(document.querySelectorAll('tr.js-navigation-item'), function (tr) {
        var icon = tr.querySelector('.icon');
        var content = tr.querySelector('.content a');

        if (!content) {
            return;
        }

        var iconHtml = getFileIconHtml(content.innerText.trim().toLowerCase());

        if (iconHtml) {
            icon.innerHTML = iconHtml;
        }
    });
}

(function() {
    'use strict';
    document.addEventListener('pjax:end', renderFileIcon);
    renderFileIcon();
})();

