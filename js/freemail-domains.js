'use strict';

function request(method, url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.onload = resolve;
        xhr.onerror = reject;
        xhr.send();
    });
}

async function getFreeMailDomains() {
    const allowCorsUrl = 'https://cors-anywhere.herokuapp.com';
    const freeMailDomainsUrl = 'http://svn.apache.org/repos/asf/spamassassin/trunk/rules/20_freemail_domains.cf';
    const result = await request('GET', `${allowCorsUrl}/${freeMailDomainsUrl}`)
    const responseText = result.target.responseText;

    const domains = [];
    const domainsStrPattern = 'freemail_domains';

    const lines = responseText.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.indexOf(domainsStrPattern) === 0) {
            const lineDomains = line.substring(domainsStrPattern.length + 1).split(' ');

            for (let j = 0; j < lineDomains.length; j++) {
                if (!domains.includes(lineDomains[j])) {
                    domains.push(lineDomains[j]);
                }
            }
        }
    }
    return domains;
}
