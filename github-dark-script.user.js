// ==UserScript==
// @name         GitHub Dark Script
// @version      2.0.0
// @description  GitHub Dark in userscript form, with a settings panel
// @namespace    https://github.com/StylishThemes
// @include      /https?://((gist|guides|help|raw|status|developer)\.)?github\.com((?!generated_pages\/preview).)*$/
// @include      /render\.githubusercontent\.com/
// @include      /raw\.githubusercontent\.com/
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      githubusercontent.com
// @connect      raw.githubusercontent.com
// @run-at       document-start
// @require      https://greasyfork.org/scripts/15563-jscolor/code/jscolor.js?version=106439
// @updateURL    https://raw.githubusercontent.com/StylishThemes/GitHub-Dark-Script/master/github-dark-script.user.js
// @downloadURL  https://raw.githubusercontent.com/StylishThemes/GitHub-Dark-Script/master/github-dark-script.user.js
// ==/UserScript==
/* global GM_addStyle, GM_getValue, GM_setValue, GM_info, GM_xmlhttpRequest, GM_registerMenuCommand, jscolor */
/* eslint-disable indent, quotes */
/* jshint esnext: true */
(() => {
  'use strict';

  const version = GM_info.script.version,

  // delay until package.json allowed to load
  delay = 8.64e7, // 24 hours in milliseconds

  // Keyboard shortcut to open ghd panel (only a two key combo coded)
  keyboardOpen = 'g+0',
  keyboardToggle = 'g+-',
  // keyboard shortcut delay from first to second letter
  keyboardDelay = 1000,

  // base urls to fetch style and package.json
  root = 'https://raw.githubusercontent.com/StylishThemes/GitHub-Dark/master/',

  defaults = {
    attach : 'scroll',
    color  : '#4183C4',
    enable : true,
    font   : 'Menlo',
    image  : 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGBAMAAACDAP+3AAAAGFBMVEUfHx8eHh4dHR0bGxshISEiIiIlJSUjIyM9IpsJAAAFjUlEQVR4AT3UuZLcOBaF4QuI2XJxboIhF/eQFe1WovoBAAqccpkaZpc5+4yrXa8/RGpx/lrIXPjFCYjTp9z8REqF4VYNWB3Av3zQJ6b6xBwlKB/9kRkCjXVwGH3ziK5UcjFHVkmgY6osiBsGDFfseqq2ZbTz7E00qBDpzOxnD7ToABeros1vM6MX0rBQaG1ith1A/HJkvkHxsPGJ82dP8vVCyWmbyPTaAfGzg40bgIdrv2f3pBVPycUcufx+BSUUWDuCZi6zBqdM50ElKYPODqtLDjc31rBb9CZ59lbN/JScuMxHLUBcGiy6QRH9zpwgZGhRj8qSydPVgNNVgbWqYX3HbM9K2rqTnKVmsmwKWzc1ffEd20+Zq3Ji65kl6TSjALNvzmJt4Pi2f1etytGJmy5erLAgbNY4bjykC3YCLIS3nSZMKgwRsBarWgjdeVzIEDzpTkoOUArTF4WFXYHwxY585sT0nmTYMxmXfs8fzwswfnam8TMU49bvqSRnyRPnqlno4tVQQiH2A9Za8tNTfXQ0lxbSxUaZna0uLlj9Q0XzD96CpsOZUftolINKBWJpAOoAJC0T6QqZnOtfvcfJFcDrD4Cuy5Hng316XrqzJ204HynyHwWed6i+XGF40Uw2T7Lc71HyssngEOrgONfBY7wvW0UZdVAma5xmSNjRp3xkvKJkW6aSg7PK4K0+mbKqYB0WYBgWwxCXiS74zBCVlEFpYQDEwjcA1qccb5yO6ZL8ozt/h3wHSCdWzLuqxU2ZZ9ev9MvRMbMvV9BQgN0qrFjlkzPQanI9nuaGCokVK2LV1Y2egyY1aFQGxjM9I7RBBAgyGEJtpKHP0lUySSeWCpyKHMT2pmM/vyP55u2Rw5lcSeabAfgiG5TPDX3uP3QvcoSipJXQByUCjS4C8VXqxEEZOJxzmJoyogFNJBRsCJs2XmoWWrWFqTsnbwtSn43gNFTTob9/SEpaPJNhUBKDGoZGCMINxvBv8vuKbb//lg/sK0wfPgBica/QsSk5F3KK4Ui6Yw+uv4+DWEOFbhdPOnbY5PLFpzrZMhakeqomY0Vz0TO+elQGTWdCk1IYFAOaoZg0IJQhT+YreXF+yia+O1cgtGufjXxQw28f85RPXfd15zv13ABoD15kB7FKJ/7pbHKP6+9TgNgkVj68NeV8Tp24f7OOndCgJzR3RNJBPNFReCmstMVqvjjzBoeK4GOFoBN32CPxu+4TwwBDa4DJTe/OU9c9ku7EGyfOVxh+fw9g/AATxPqKTEXJKEdCIBkB4iBUlO6MjUrWi6M5Kz31YAqFsYaCeB0KJC5d1+foo3LQWSfRaDrwdAQrMEC27yDZXJf7TlOJ2Bczr1di3OWvZB6XrvvqPuWJPDk9dAHgm7LvuZJTEdKqO3J3XgostArEnvkqgUznx3PX7cSzz1FXZyvakTA4XVVMbCPFPK1cFj66S0WoqQI1XG2uoU7CMPquO2VaUDJFQMdVgXKD2bpz6ufzzxXbxszHQ9fGO/F7A998yBQG6cShE+P+Pk7t1FwfF1QHN1Eui1VapRxCdj8tCtI1bog1Fo011Sx9u3o6c9bufI6wAT26Av9xJ+WWpTKbbBPp3K/1LbC4Vuhv396RCbJw4untjxVPndj+dIB9dVD8z2dylZ+6vMeJwbYChHJkvHV2J3fdHsJPASeHhrXq6QheXu1nBhUr5u6ryT0I13BFKD01ViZ/n3oaziRG7c6Ayg7g1LPeztNdT36ueMqcN4XGv3finjfv+7I/kMJ4d046MUanOA1QtMH1kLlfFasm99NiutSw63yNDeH4zeL1Uu8XKHNfcThPSSNwchGMbgUETScwkCcK77pH2jsgrAssvVyB8FLJ7GrmwyD8eVqsHoY/FwIv9T7lPu9+Yf8/9+w4nS1ma78AAAAASUVORK5CYII=")',
    tab    : 4,
    theme  : 'Twilight',
    type   : 'tiled',
    wrap   : false,

    // internal variables
    date         : 0,
    version      : 0,
    rawCss       : '',
    themeCss     : '',
    processedCss : ''

  },

  // extract style & theme name
  regex = /\/\*! [^\*]+ \*\//,
  // "themes/" prefix not included here
  themes = {
    'Ambiance' : 'ambiance.min.css',
    'Chaos' : 'chaos.min.css',
    'Clouds Midnight' : 'clouds-midnight.min.css',
    'Cobalt' : 'cobalt.min.css',
    'Idle Fingers' : 'idle-fingers.min.css',
    'Kr Theme' : 'kr-theme.min.css',
    'Merbivore' : 'merbivore.min.css',
    'Merbivore Soft' : 'merbivore-soft.min.css',
    'Mono Industrial' : 'mono-industrial.min.css',
    'Mono Industrial Clear' : 'mono-industrial-clear.min.css',
    'Monokai' : 'monokai.min.css',
    'Obsidian' : 'obsidian.min.css',
    'Pastel on Dark' : 'pastel-on-dark.min.css',
    'Solarized Dark' : 'solarized-dark.min.css',
    'Terminal' : 'terminal.min.css',
    'Tomorrow Night' : 'tomorrow-night.min.css',
    'Tomorrow Night Blue' : 'tomorrow-night-blue.min.css',
    'Tomorrow Night Bright' : 'tomorrow-night-bright.min.css',
    'Tomorrow Night Eigthies' : 'tomorrow-night-eighties.min.css',
    'Twilight' : 'twilight.min.css',
    'Vibrant Ink' : 'vibrant-ink.min.css'
  },

  type = {
    tiled : `
      background-repeat: repeat !important;
      background-size: auto !important;
      background-position: left top !important;
    `,
    fit : `
      background-repeat: no-repeat !important;
      background-size: cover !important;
      background-position: center top !important;
    `
  },

  wrapCss = {
    wrapped : `
      white-space: pre-wrap !important;
      word-break: break-all !important;
      display: block !important;
    `,
    unwrap  : `
      white-space: pre !important;
      word-break: normal !important;
      display: block !important;
    `
  },

  // https://github.com/StylishThemes/GitHub-code-wrap/blob/master/github-code-wrap.css
  wrapCodeCss = `
    /* GitHub: Enable wrapping of long code lines */
      .blob-code-inner,
      .markdown-body pre > code,
      .markdown-body .highlight > pre {
        white-space: pre-wrap !important;
        word-break: break-all !important;
        display: block !important;
      }
      td.blob-code-inner {
        display: table-cell !important;
      }
  `,

  wrapIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="768" height="768" viewBox="0 0 768 768">
      <path d="M544.5 352.5q52.5 0 90 37.5t37.5 90-37.5 90-90 37.5H480V672l-96-96 96-96v64.5h72q25.5 0 45-19.5t19.5-45-19.5-45-45-19.5H127.5v-63h417zm96-192v63h-513v-63h513zm-513 447v-63h192v63h-192z"/>
    </svg>
  `,

  monospaceIcon = `
    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewbox="0 0 32 32">
      <path d="M5.91 7.31v8.41c0 .66.05 1.09.14 1.31.09.21.23.37.41.48.18.11.52.16 1.02.16v.41H2.41v-.41c.5 0 .86-.05 1.03-.14.16-.11.3-.27.41-.5.11-.23.16-.66.16-1.3V11.7c0-1.14-.04-1.87-.11-2.2-.04-.26-.13-.42-.24-.53-.11-.1-.27-.14-.46-.14-.21 0-.48.05-.77.18l-.18-.41 3.14-1.28h.52v-.01zm-.95-5.46c.32 0 .59.11.82.34.23.23.34.5.34.82 0 .32-.11.59-.34.82-.23.22-.51.34-.82.34-.32 0-.59-.11-.82-.34s-.36-.5-.36-.82c0-.32.11-.59.34-.82.24-.23.51-.34.84-.34zm19.636 19.006h-3.39v-1.64h5.39v9.8h3.43v1.66h-9.18v-1.66h3.77v-8.16h-.02zm.7-6.44c.21 0 .43.04.63.13.18.09.36.2.5.34s.25.3.34.5c.07.18.13.39.13.61 0 .22-.04.41-.13.61s-.19.36-.34.5-.3.25-.5.32c-.2.09-.39.13-.62.13-.21 0-.43-.04-.61-.12-.19-.07-.35-.19-.5-.34-.14-.14-.25-.3-.34-.5-.07-.2-.13-.39-.13-.61s.04-.43.13-.61c.07-.18.2-.36.34-.5s.31-.25.5-.34c.17-.09.39-.12.6-.12zM2 30L27.82 2H30L4.14 30H2z"/>
    </svg>
  `,

  fileIcon = `
    <svg class="octicon" xmlns="http://www.w3.org/2000/svg" width="10" height="6.5" viewBox="0 0 10 6.5">
      <path d="M0 1.497L1.504 0l3.49 3.76L8.505.016 10 1.52 4.988 6.51 0 1.496z"/>
    </svg>
  `,

  $style = make({
    el: 'style',
    cl4ss: 'ghd-style'
  });

  let timer, picker, // jscolor picker
  isInitialized = false,
  // prevent mutationObserver from going nuts
  isUpdating = false,
  // set when css code to test is pasted into the settings panel
  testing = false,
  //
  debug = GM_getValue('debug', false),
  data = {};

  function updatePanel() {
    if (!isInitialized) { return; }
    // prevent multiple change events from processing
    isUpdating = true;

    let color,
      body = $('body'),
      panel = $('#ghd-settings-inner');

    $('.ghd-attach', panel).value = data.attach || defaults.attach;
    $('.ghd-font', panel).value = data.font || defaults.font;
    $('.ghd-image', panel).value = data.image || defaults.image;
    $('.ghd-tab', panel).value = data.tab || defaults.tab;
    $('.ghd-theme', panel).value = data.theme || defaults.theme;
    $('.ghd-type', panel).value = data.type || defaults.type;

    $('.ghd-enable', panel).checked = typeof data.enable === 'boolean' ? data.enable : defaults.enable;
    $('.ghd-wrap', panel).checked = typeof data.wrap === 'boolean' ? data.wrap : defaults.wrap;

    color = data.color || defaults.color;
    $('.ghd-color').value = color;
    // update swatch color & color picker value
    $('#ghd-swatch').style.backgroundColor = color;

    if (picker) {
      picker.fromString(color);
    }
    $style.disabled = !data.enable;

    toggle(body, 'ghd-disabled', !data.enable);
    toggle(body, 'nowrap', !data.wrap);

    isUpdating = false;
  }

  /*
  data = {
    attach  : 'scroll',
    color   : '#4183C4',
    enable  : true,
    font    : 'Menlo',
    image   : 'url()',
    tab     : 4,
    theme   : 'Tomorrow Night',
    type    : 'tiled',
    wrap    : true, // code: wrap long lines

    date    : 1450159200000, // last loaded package.json
    version : '001014032',   // v1.14.32 = last stored GitHub-Dark version

    rawCss       : '@-moz-document regexp("^...', // unprocessed github-dark.css
    themeCss     : '/*! Tomorrow Night * /...',   // unprocessed theme/{name}.min.css
    processedCss : '' // processed css, saved directly from $style
  }
  */
  function getStoredValues(init) {
    data = GM_getValue('data', defaults);
    if (debug) {
      if (init) {
        console.log('GitHub-Dark Script initializing!');
      }
      console.log('Retrieved stored values', data);
    }
  }

  function setStoredValues(reset) {
    data.processedCss = $style.textContent;
    GM_setValue('data', reset ? defaults : data);
    updatePanel();
    if (debug) {
      console.log((reset ? 'Resetting' : 'Saving') + ' current values', data);
    }
  }

  // convert version "1.2.3" into "001002003" for easier comparison
  function convertVersion(val) {
    let index,
      parts = val ? val.split('.') : '',
      str = '',
      len = parts.length;
    for (index = 0; index < len; index++) {
      str += ('000' + parts[index]).slice(-3);
    }
    if (debug) {
      console.log(`Converted version "${val}" to "${str}" for easy comparison`);
    }
    return val ? str : val;
  }

  function checkVersion() {
    if (debug) {
      console.log('Fetching package.json');
    }
    GM_xmlhttpRequest({
      method : 'GET',
      url : root + 'package.json',
      onload : response => {
        let pkg = JSON.parse(response.responseText);

        // save last loaded date, so package.json is only loaded once a day
        data.date = new Date().getTime();

        let ver = convertVersion(pkg.version);
        // if new available, load it & parse
        if (ver > data.version) {
          if (data.version !== 0 && debug) {
            console.log('Updating from ${data.version} to ${ver}');
          }
          data.version = ver;
          fetchAndApplyStyle();
        } else {
          addSavedStyle();
        }
        // save new date/version
        GM_setValue('data', data);
      }
    });
  }

  function fetchAndApplyStyle() {
    if (debug) {
      console.log('Fetching github-dark.css');
    }
    GM_xmlhttpRequest({
      method : 'GET',
      url : root + 'github-dark.css',
      onload : response => {
        data.rawCss = response.responseText;
        processStyle();
      }
    });
  }

  // load syntax highlighting theme
  function fetchAndApplyTheme() {
    if (!data.enable) {
      if (debug) {
        console.log('Disabled: stop theme processing');
      }
      return;
    }
    if (data.lastTheme === data.theme) {
      return applyTheme();
    }
    let name = data.theme || 'Twilight',
      themeUrl = root + 'themes/' + themes[name];
    if (debug) {
      console.log(`Fetching ${name} theme`, themeUrl);
    }
    GM_xmlhttpRequest({
      method : 'GET',
      url : themeUrl,
      onload : response => {
        let theme = response.responseText;
        if (response.status === 200 && theme) {
          data.themeCss = theme;
          data.lastTheme = name;
          applyTheme();
        } else {
          throw Error(`Failed to load theme file: "${theme}"`);
        }
      }
    });
  }

  function applyTheme() {
    if (debug) {
      console.log('Adding syntax theme "' + (data.themeCss || '').match(regex) + '" to css');
    }
    let css = data.processedCss || '';
    css = css.replace('/*[[syntax-theme]]*/', data.themeCss || '');
    applyStyle(css);
    setStoredValues();
    isUpdating = false;
  }

  function processStyle() {
    let url = /^url/.test(data.image || '') ? data.image :
      (data.image === 'none' ? 'none' : 'url("' + data.image + '")');
    if (!data.enable) {
      if (debug) {
        console.log('Disabled: stop processing');
      }
      return;
    }
    if (debug) {
      console.log('Processing set styles');
    }

    let processed = (data.rawCss || '')
      // remove moz-document wrapper
      .replace(/@-moz-document regexp\((.*)\) \{(\n|\r)+/, '')
      // replace background image; if no 'url' at start, then use 'none'
      .replace(/\/\*\[\[bg-choice\]\]\*\/ url\(.*\)/, url)
      // Add tiled or fit window size css
      .replace('/*[[bg-options]]*/', type[data.type || 'tiled'])
      // set scroll or fixed background image
      .replace('/*[[bg-attachment]]*/ fixed', data.attach || 'scroll')
      // replace base-color
      .replace(/\/\*\[\[base-color\]\]\*\/ #\w{3,6}/g, data.color || '#4183C4')
      // add font choice
      .replace('/*[[font-choice]]*/', data.font || 'Menlo')
      // add tab size
      .replace(/\/\*\[\[tab-size\]\]\*\/ \d+/g, data.tab || 4)
      // code wrap css
      .replace('/*[[code-wrap]]*/', data.wrap ? wrapCodeCss : '')
      // remove default syntax
      .replace(/\s+\/\* grunt build - remove to end of file(.*(\n|\r))+\}$/m, '');

    // see https://github.com/StylishThemes/GitHub-Dark/issues/275
    if (/firefox/i.test(navigator.userAgent)) {
      processed = processed
        .replace(/select, input, textarea/, 'select, input:not([type="checkbox"]), textarea')
        .replace(/input\[type=\"checkbox\"\][\s\S]+?}/gm, '');
    }
    data.processedCss = processed;
    fetchAndApplyTheme();
  }

  function applyStyle(css) {
    if (debug) {
      console.log('Applying style', '"' + (css || '').match(regex) + '"');
    }
    $style.textContent = css || '';
  }

  function addSavedStyle() {
    if (debug) {
      console.log('Adding previously saved style');
    }
    // apply already processed css to prevent FOUC
    $style.textContent = data.processedCss;
  }

  function updateStyle() {
    isUpdating = true;

    if (debug) {
      console.log('Updating user settings');
    }

    let body = $('body'),
      panel = $('#ghd-settings-inner');

    data.attach = $('.ghd-attach', panel).value;
    // get hex value directly
    data.color = picker.toHEXString();
    data.enable = $('.ghd-enable', panel).checked;
    data.font   = $('.ghd-font', panel).value;
    data.image  = $('.ghd-image', panel).value;
    data.tab    = $('.ghd-tab', panel).value;
    data.theme  = $('.ghd-theme', panel).value;
    data.type   = $('.ghd-type', panel).value;
    data.wrap   = $('.ghd-wrap', panel).checked;

    $style.disabled = !data.enable;

    toggle(body, 'ghd-disabled', !data.enable);
    toggle(body, 'nowrap', !data.wrap);

    if (testing) {
      processStyle();
      testing = false;
    } else {
      fetchAndApplyStyle();
    }
    isUpdating = false;
  }

  // user can force GitHub-dark update
  function forceUpdate(css) {
    if (css) {
      // add raw css directly for style testing
      data.rawCss = css;
      processStyle();
    } else {
      // clear saved date
      data.version = 0;
      GM_setValue('data', data);
      document.location.reload();
    }
  }

  function buildSettings() {
    if (debug) {
      console.log('Adding settings panel & GitHub Dark link to profile dropdown');
    }
    // Script-specific CSS
    GM_addStyle(`
      #ghd-menu:hover { cursor:pointer }
      #ghd-settings { position:fixed; z-index: 65535; top:0; bottom:0; left:0; right:0; opacity:0; visibility:hidden; }
      #ghd-settings.in { opacity:1; visibility:visible; background:rgba(0,0,0,.5); }
      #ghd-settings-inner { position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); width:25rem; box-shadow: 0 .5rem 1rem #111; color:#c0c0c0 }
      #ghd-settings label { margin-left:.5rem; position:relative; top:-1px }
      #ghd-settings-close { height: 1rem; width: 1rem; fill: #666; float:right; cursor:pointer }
      #ghd-settings-close:hover { fill: #ccc }
      #ghd-settings .ghd-right { float: right; padding:5px; }
      #ghd-settings p { line-height: 25px; }
      #ghd-swatch { width:25px; height:25px; display:inline-block; margin:3px 10px; border-radius:4px; }
      #ghd-settings .checkbox input { margin-top: .35em }
      #ghd-settings input[type="text"] { border: #555 1px solid; }
      #ghd-settings input[type="checkbox"] { width: 16px !important; height: 16px !important; border-radius: 3px !important; }
      #ghd-settings .boxed-group-inner { padding: 0; }
      #ghd-settings .ghd-footer { padding: 10px; border-top: #555 solid 1px; }
      #ghd-settings .ghd-settings-wrapper { max-height: 60vh; overflow-y:auto; padding: 1px 10px; }
      #ghd-settings .ghd-tab { width: 5em; }
      #ghd-settings .ghd-info, .ghd-file-toggle svg { vertical-align: middle !important; }
      #ghd-settings .paste-area { position:absolute; bottom:50px; top:37px; left:2px; right:2px; width:396px; z-index:0; }

      /* code wrap toggle: https://gist.github.com/silverwind/6c1701f56e62204cc42b
      icons next to a pre */
      .ghd-wrap-toggle { position:absolute; right:1.4em; margin-top:.2em; -moz-user-select:none; -webkit-user-select:none; cursor:pointer; z-index:20; }
      /* file & diff code tables */
      .ghd-wrap-table .blob-code-inner { white-space: pre-wrap !important; word-break: break-all !important; }
      .ghd-unwrap-table .blob-code-inner { white-space: pre !important; word-break: normal !important; }
      .ghd-wrap-toggle > *, .ghd-monospace > *, .ghd-file-toggle > * { pointer-events:none; }
      /* icons inside a wrapper immediatly around a pre */
      .highlight > .ghd-wrap-toggle { right:.5em; top:.5em; margin-top:0; }
      /* icons for non-syntax highlighted code blocks; see https://github.com/gjtorikian/html-proofer/blob/master/README.md */
      .markdown-body:not(.comment-body) .ghd-wrap-toggle:not(:first-child) { right: 3.4em; }
      .ghd-wrap-toggle svg { height:1.25em; width:1.25em; fill:rgba(110,110,110,.4); }
      /* wrap disabled (red) */
      .ghd-wrap-toggle.unwrap:hover svg, .ghd-wrap-toggle:hover svg { fill:#8b0000; }
      /* wrap enabled (green) */
      body:not(.nowrap) .ghd-wrap-toggle:not(.unwrap):hover svg, .ghd-wrap-toggle.wrapped:hover svg { fill:#006400; }
      .blob-wrapper, .markdown-body pre, .markdown-body .highlight { position:relative; }
      /* hide wrap icon when style disabled */
      body.ghd-disabled .ghd-wrap-toggle, .ghd-collapsed-file, .file.open .data.ghd-collapsed-file { display: none; }
      /* monospace font toggle */
      .ghd-monospace-font { font-family: Menlo, Inconsolata, "Droid Mono", monospace !important; font-size: 1em !important; }
      /* file collapsed icon */
      .ghd-file-collapsed svg { -webkit-transform:rotate(90deg); transform:rotate(90deg); }
    `);

    let panel, indx, theme,
      ver = [],
      opts = '',
      names = Object.keys(themes),
      len = names.length,
      // convert stored css version from "001014049" into "1.14.49" for tooltip
      parts = String(data.version).match(/\d{3}/g);
    for (indx = 0; indx < len; indx++) {
      theme = names[indx];
      opts += `<option value="${theme}">${theme}</option>`;
    }
    if (parts && parts.length) {
      len = parts.length;
      for (indx = 0; indx < len; indx++) {
        ver.push(parseInt(parts[indx], 10));
      }
    }

    // Settings panel markup
    panel = make({
      el : 'div',
      attr : { id: 'ghd-settings' },
      html : `
        <div id="ghd-settings-inner" class="boxed-group">
          <h3>GitHub-Dark Settings
          <svg id="ghd-settings-close" xmlns="http://www.w3.org/2000/svg" width="768" height="768" viewBox="160 160 608 608"><path d="M686.2 286.8L507.7 465.3l178.5 178.5-45 45-178.5-178.5-178.5 178.5-45-45 178.5-178.5-178.5-178.5 45-45 178.5 178.5 178.5-178.5z"/></svg>
          </h3>
          <div class="boxed-group-inner">
            <form>
              <div class="ghd-settings-wrapper">
                <p class="checkbox">
                  <label>Enable GitHub-Dark<input class="ghd-enable ghd-right" type="checkbox"></label>
                </p>
                <p>
                  <label>Color:</label>
                  <input class="ghd-color ghd-right" type="text" value="#4183C4">
                  <span id="ghd-swatch" class="ghd-right"></span>
                </p>
                <h4>Background</h4>
                <p>
                  <label>Image:</label>
                  <input class="ghd-image ghd-right" type="text">
                  <a href="https://github.com/StylishThemes/GitHub-Dark/wiki/Image" class="tooltipped tooltipped-e" aria-label="Click to learn about GitHub\'s Content Security&#10;Policy and how to add a custom image"><sup>?</sup></a>
                </p>
                <p>
                  <label>Image type:</label>
                  <select class="ghd-type ghd-right">
                    <option value="tiled">Tiled</option>
                    <option value="fit">Fit window</option>
                  </select>
                </p>
                <p>
                  <label>Image attachment:</label>
                  <select class="ghd-attach ghd-right">
                    <option value="scroll">Scroll</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </p>
                <h4>Code</h4>
                <p><label>Theme:</label> <select class="ghd-theme ghd-right">${opts}</select></p>
                <p>
                  <label>Font Name:</label> <input class="ghd-font ghd-right" type="text">
                  <a href="http://www.cssfontstack.com/" class="tooltipped tooltipped-e" aria-label="Add a system installed (monospaced) font name;&#10;this script will not load external fonts!"><sup>?</sup></a>
                </p>
                <p>
                  <label>Tab Size:</label> <input class="ghd-tab ghd-right" type="text">
                </p>
                <p class="checkbox">
                 <label>Wrap<input class="ghd-wrap ghd-right" type="checkbox"></label>
                </p>
              </div>
              <div class="ghd-footer">
                <div class="btn-group">
                  <a href="#" class="ghd-update btn btn-sm tooltipped tooltipped-n tooltipped-multiline" aria-label="Update style if the newest release is not loading; the page will reload!">Force Update Style</a>
                  <a href="#" class="ghd-textarea-toggle btn btn-sm tooltipped tooltipped-n" aria-label="Paste CSS update">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewbox="0 0 16 16" fill="#eee">
                      <path d="M15 11 1 11 8 3z"/>
                    </svg>
                  </a>
                  <div class="paste-area-content" aria-hidden="true" style="display:none">
                    <textarea class="paste-area" placeholder="Paste GitHub-Dark Style here!"></textarea>
                  </div>
                </div>&nbsp;
                <a href="#" class="ghd-reset btn btn-sm btn-danger tooltipped tooltipped-n" aria-label="Reset to defaults;&#10;there is no undo!">Reset All Settings</a>
                  <span class="ghd-right tooltipped tooltipped-n" aria-label="Script v${version}&#10;CSS ${(ver.length ? 'v' + ver.join('.') : 'unknown')}">
                  <svg class="ghd-info" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24">
                    <path fill="#444" d="M12,9c0.82,0,1.5-0.68,1.5-1.5S12.82,6,12,6s-1.5,0.68-1.5,1.5S11.18,9,12,9z M12,1.5 C6.211,1.5,1.5,6.211,1.5,12S6.211,22.5,12,22.5S22.5,17.789,22.5,12S17.789,1.5,12,1.5z M12,19.5c-4.148,0-7.5-3.352-7.5-7.5 S7.852,4.5,12,4.5s7.5,3.352,7.5,7.5S16.148,19.5,12,19.5z M13.5,12c0-0.75-0.75-1.5-1.5-1.5s-0.75,0-1.5,0S9,11.25,9,12h1.5 c0,0,0,3.75,0,4.5S11.25,18,12,18s0.75,0,1.5,0s1.5-0.75,1.5-1.5h-1.5C13.5,16.5,13.5,12.75,13.5,12z"/>
                  </svg>
                </span>
              </div>
            </form>
          </div>
        </div>
      `
    });
    $('body').appendChild(panel);

    updateToggles();
  }

  // Add code wrap toggle
  function buildCodeWrap() {
    // mutation events happen quick, so we still add an update flag
    isUpdating = true;
    let icon = make({
      el    : 'div',
      cl4ss : 'ghd-wrap-toggle tooltipped tooltipped-w',
      attr  : { 'aria-label' : 'Toggle code wrap' },
      html  : wrapIcon
    });
    $$('.blob-wrapper').forEach(el => {
      el.insertBefore(icon.cloneNode(true), el.childNodes[0]);
    });
    $$('.markdown-body pre').forEach(el => {
      el.parentNode.insertBefore(icon.cloneNode(true), el);
    });
    isUpdating = false;
  }

  // Add monospace font toggle
  function addMonospaceToggle() {
    isUpdating = true;
    let button = make({
      el    : 'button',
      cl4ss : 'ghd-monospace toolbar-item tooltipped tooltipped-n',
      attr  : {
        'type' : 'button',
        'aria-label' : 'Toggle monospaced font',
        'tabindex' : '-1'
      },
      html  : monospaceIcon
    });
    $$('.toolbar-commenting').forEach(el => {
      if (!$('.ghd-monospace', el)) {
        // prepend
        el.insertBefore(button.cloneNode(true), el.childNodes[0]);
      }
    });
    isUpdating = false;
  }

  // Add file diffs toggle
  function addFileToggle() {
    isUpdating = true;
    var button = make({
      el    : 'button',
      cl4ss : 'ghd-file-toggle btn btn-sm tooltipped tooltipped-n',
      attr  : {
        'type' : 'button',
        'aria-label' : 'Click to Expand or Collapse file',
        'tabindex' : '-1'
      },
      html  : fileIcon
    });
    $$('#files .file-actions').forEach(el => {
      if (!$('.ghd-file-toggle', el)) {
        el.appendChild(button.cloneNode(true));
      }
    });
    isUpdating = false;
  }

  // Add toggle buttons after page updates
  function updateToggles() {
    buildCodeWrap();
    addMonospaceToggle();
    addFileToggle();
  }

  function makeRow(vals, str) {
    return make({
      el : 'tr',
      cl4ss : 'ghd-shortcut',
      html : `<td class="keys"><kbd>${vals[0]}</kbd> <kbd>${vals[1]}</kbd></td><td>${str}</td>`
    });
  }

  // add keyboard shortcut to help menu (press "?")
  function buildShortcut() {
    let el,
      row1 = makeRow(keyboardOpen.split('+'), 'GitHub-Dark: open settings'),
      row2 = makeRow(keyboardToggle.split('+'), 'GitHub-Dark: toggle style');
    if (!$('.ghd-shortcut')) {
      el = $('.keyboard-mappings tbody');
      el.appendChild(row1);
      el.appendChild(row2);
    }
  }

  function toggleCodeWrap(el) {
    let css,
      overallWrap = data.wrap,
      code = next(el, '.highlight, .diff-table, code, pre'),
      tmp = code ? next(code, 'code') : '';
    if (tmp) {
      // find code element
      code = tmp;
    }
    if (!code) {
      if (debug) {
        console.log('Code wrap icon associated code not found', el);
      }
      return;
    }
    // code with line numbers
    if (code.nodeName === 'TABLE') {
      if (code.className.indexOf('ghd-') < 0) {
        css = !overallWrap;
      } else {
        css = code.classList.contains('ghd-unwrap-table');
      }
      toggle(code, 'ghd-wrap-table', css);
      toggle(code, 'ghd-unwrap-table', !css);
      toggle(el, 'wrapped', css);
      toggle(el, 'unwrap', !css);
    } else {
      css = (code.getAttribute('style') || '').trim();
      if (css === '') {
        css = wrapCss[overallWrap ? 'unwrap' : 'wrapped'];
      } else {
        css = wrapCss[css === wrapCss.wrapped ? 'unwrap' : 'wrapped'];
      }
      code.setAttribute('style', css);
      toggle(el, 'wrapped', css === wrapCss.wrapped);
      toggle(el, 'unwrap', css === wrapCss.unwrap);
    }
  }

  function toggleMonospace(el) {
    let tmp = closest(el, '.previewable-comment-form'),
      // single comment
      textarea = $('.comment-form-textarea', tmp);
    if (textarea) {
      toggle(textarea, 'ghd-monospace-font');
      textarea.focus();
      tmp = textarea.classList.contains('ghd-monospace-font');
      toggle(el, 'ghd-icon-active', tmp);
    }
  }

  function toggleFile(el, shift) {
    isUpdating = true;
    toggle(el, 'ghd-file-collapsed');

    let tmp = closest(el, '.file-header'),
      block = nextAll(tmp, '.blob-wrapper, .render-wrapper, .image, .rich-diff');
    // toggle view of file or image; "image" class added to "Diff suppressed..."
    toggle(block, 'ghd-collapsed-file');

    // shift+click toggle all files!
    if (shift) {
      let isCollapsed = el.classList.contains('ghd-file-collapsed');
      $$('.ghd-file-toggle').forEach(tmp => {
        if (tmp !== el) {
          toggle(tmp, 'ghd-file-collapsed', isCollapsed);
          tmp = closest(tmp, '.file-header');
          tmp = nextAll(tmp, '.blob-wrapper, .render-wrapper, .image, .rich-diff');
          toggle(tmp, 'ghd-collapsed-file', isCollapsed);
        }
      });
    }
    isUpdating = false;
  }

  function bindEvents() {
    let el, cb, menu, lastKey,
      panel = $('#ghd-settings-inner'),
      swatch = $('#ghd-swatch', panel);

    // finish initialization
    $('#ghd-settings-inner .ghd-enable').checked = data.enable;
    toggle($('body'), 'ghd-disabled', !data.enable);

    // Create our menu entry
    menu = make({
      el : 'a',
      cl4ss : 'dropdown-item',
      html : 'GitHub Dark Settings',
      attr : { id : 'ghd-menu' }
    });

    el = $$('.header .dropdown-item[href="/settings/profile"], .header .dropdown-item[data-ga-click*="go to profile"]');
    // get last found item - gists only have the "go to profile" item; GitHub has both
    el = el[el.length - 1];
    if (el) {
      // insert after
      el.parentNode.insertBefore(menu, el.nextSibling);
      on($('#ghd-menu'), 'click', () => {
        openPanel();
      });
    }

    on(document, 'keypress keydown', event => {
      clearTimeout(timer);
      // use "g+o" to open up ghd options panel
      let openKeys = keyboardOpen.split('+'),
        toggleKeys = keyboardToggle.split('+'),
        key = String.fromCharCode(event.which).toLowerCase(),
        panelVisible = $('#ghd-settings').classList.contains('in');

      // press escape to close the panel
      if (event.which === 27 && panelVisible) {
        closePanel();
        return;
      }
      // use event.which from keypress for shortcuts
      // prevent opening panel while typing "go" in comments
      if (event.type === 'keydown' || /(input|textarea)/i.test(document.activeElement.nodeName)) {
        return;
      }
      if (lastKey === openKeys[0] && key === openKeys[1]) {
        if (panelVisible) {
          closePanel();
        } else {
          openPanel();
        }
      }
      if (lastKey === toggleKeys[0] && key === toggleKeys[1]) {
        toggleStyle();
      }
      lastKey = key;
      timer = setTimeout(() => {
        lastKey = null;
      }, keyboardDelay);

      // add shortcut to help menu
      if (key === '?') {
        // table doesn't exist until user presses "?"
        setTimeout(() => {
          buildShortcut();
        }, 300);
      }
    });

    // add ghd-settings panel bindings
    on($$('#ghd-settings, #ghd-settings-close'), 'click keyup', event => {
      // press escape to close settings
      if (event.type === 'keyup' && event.which !== 27) {
        return;
      }
      closePanel();
    });

    on(panel, 'click', event => {
      event.stopPropagation();
    });

    on($('.ghd-reset', panel), 'click', () => {
      isUpdating = true;
      // pass true to reset values
      setStoredValues(true);
      // add reset values back to data
      getStoredValues();
      // add reset values to panel
      updatePanel();
      // update style
      updateStyle();
      return false;
    });

    on($$('input[type="text"]', panel), 'focus', function() {
      // select all text when focused
      this.select();
    });

    on($$('select, input', panel), 'change', () => {
      if (!isUpdating) {
        updateStyle();
      }
    });

    on($('.ghd-update', panel), 'click', () => {
      forceUpdate();
      return false;
    });

    on($('.ghd-textarea-toggle', panel), 'click', function() {
      let hidden, el;
      this.classList.remove('selected');
      el = next(this, '.paste-area-content');
      if (el) {
        hidden = el.style.display === 'none';
        el.style.display = hidden ? '' : 'none';
        if (el.style.display !== 'none') {
          el.classList.add('selected');
          el = $('textarea', el);
          el.focus();
          el.select();
        }
      }
      return false;
    });

    on($('.paste-area-content', panel), 'paste', event => {
      let toggle = $('.ghd-textarea-toggle', panel),
        textarea = event.target;
      setTimeout(() => {
        textarea.parentNode.style.display = 'none';
        toggle.classList.remove('selected');
        testing = true;
        forceUpdate(textarea.value);
      }, 200);
    });

    // Toggles
    on($('body'), 'click', event => {
      let target = event.target;
      if (target.classList.contains('ghd-wrap-toggle')) {
        // **** CODE WRAP TOGGLE ****
        event.stopPropagation();
        toggleCodeWrap(target);
      } else if (target.classList.contains('ghd-monospace')) {
        // **** MONOSPACE FONT TOGGLE ****
        event.stopPropagation();
        toggleMonospace(target);
        return false;
      } else if (target.classList.contains('ghd-file-toggle')) {
        // **** CODE DIFF COLLAPSE TOGGLE ****
        event.stopPropagation();
        toggleFile(target, event.shiftKey);
      }
    });

    // style color picker
    picker = new jscolor($('.ghd-color', panel));
    picker.zIndex = 65536;
    picker.hash = true;
    picker.backgroundColor = '#333';
    picker.padding = 0;
    picker.borderWidth = 0;
    picker.borderColor = '#444';
    picker.onFineChange = () => {
      swatch.style.backgroundColor = '#' + picker;
    };
  }

  function openPanel() {
    $('.modal-backdrop').click();
    updatePanel();
    $('#ghd-settings').classList.add('in');
  }

  function closePanel() {
    $('#ghd-settings').classList.remove('in');
    picker.hide();

    // apply changes when the panel is closed
    updateStyle();
  }

  function toggleStyle() {
    let isEnabled = !data.enable;
    data.enable = isEnabled;
    $('#ghd-settings-inner .ghd-enable').checked = isEnabled;
    // add processedCss back into style (emptied when disabled)
    if (isEnabled) {
    	// data.processedCss is empty when ghd is disabled on init
      if (!data.processedCss) {
        processStyle();
      } else {
        addSavedStyle();
      }
    }
    $style.disabled = !isEnabled;
  }

  function init() {
    // add style tag to head
    $('head').appendChild($style);

    getStoredValues(true);

    $style.disabled = !data.enable;
    data.lastTheme = data.theme;

    // only load package.json once a day, or after a forced update
    if ((new Date().getTime() > data.date + delay) || data.version === 0) {
      // get package.json from GitHub-Dark & compare versions
      // load new script if a newer one is available
      checkVersion();
    } else {
      addSavedStyle();
    }
  }

  // add style at document-start
  init();

  on(document, 'DOMContentLoaded', () => {
    // add panel even if you're not logged in - open panel using keyboard shortcut
    buildSettings();
    // add event binding on document ready
    bindEvents();

    $$('#js-repo-pjax-container, #js-pjax-container, .js-contribution-activity').forEach(target => {
      new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          // preform checks before adding code wrap to minimize function calls
          if (!(isUpdating || $$('.ghd-wrap-toggle').length) &&
            mutation.target === target) {
            updateToggles();
          }
        });
      }).observe(target, {
        childList: true,
        subtree: true
      });
    });

    isInitialized = true;
  });

  /* utility functions */
  function $(str, el) {
    return (el || document).querySelector(str);
  }
  function $$(str, el) {
    return Array.from((el || document).querySelectorAll(str));
  }
  function next(el, selector) {
    while ((el = el.nextElementSibling)) {
      if (el && el.matches(selector)) {
        return el;
      }
    }
    return null;
  }
  function nextAll(el, selector) {
    let siblings = [];
    while ((el = el.nextElementSibling)) {
      if (el && el.matches(selector)) {
        siblings.push(el);
      }
    }
    return siblings;
  }
  function closest(el, selector) {
    while (el && el.nodeName !== 'BODY' && !el.matches(selector)) {
      el = el.parentNode;
    }
    return el.matches(selector) ? el : [];
  }
  function make(obj) {
    let key,
      el = document.createElement(obj.el);
    if (obj.cl4ss) { el.className = obj.cl4ss; }
    if (obj.html) { el.innerHTML = obj.html; }
    if (obj.attr) {
      for (key in obj.attr) {
        if (obj.attr.hasOwnProperty(key)) {
          el.setAttribute(key, obj.attr[key]);
        }
      }
    }
    return el;
  }
  function on(els, name, callback) {
    els = Array.isArray(els) ? els : [els];
    let events = name.split(/\s+/);
    els.forEach(el => {
      events.forEach(ev => {
        el.addEventListener(ev, callback);
      });
    });
  }
  function toggle(els, cl4ss, flag) {
    els = Array.isArray(els) ? els : [els];
    els.forEach(el => {
      if (typeof flag === 'undefined') {
        flag = !el.classList.contains(cl4ss);
      }
      if (flag) {
        el.classList.add(cl4ss);
      } else {
        el.classList.remove(cl4ss);
      }
    });
  }

  // Add GM options
  GM_registerMenuCommand("GitHub Dark Script debug logging", () => {
    let val = prompt('Toggle GitHub Dark Script debug log (true/false):', !debug);
    debug = /^t/.test(val);
    GM_setValue('debug', debug);
  });

})();
