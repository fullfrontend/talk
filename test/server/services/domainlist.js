const expect = require('chai').expect;
const Domainlist = require('../../../services/domainlist');
const SettingsService = require('../../../services/settings');

describe('services.Domainlist', () => {

  const domainlists = {
    whitelist: [
      'nytimes.com',
      'wapo.com'
    ]
  };

  let domainlist = new Domainlist();
  const settings = {id: '1', moderation: 'PRE', domainlist: {whitelist: ['nytimes.com', 'wapo.com']}};

  beforeEach(() => SettingsService.init(settings));

  describe('#init', () => {

    before(() => domainlist.upsert(domainlists));

    it('has entries', () => {
      expect(domainlist.lists.whitelist).to.not.be.empty;
    });

  });

  describe('#parseURL', () => {
    it('parses the domain correctly', () => {
      [
        ['http://google.ca/test', 'google.ca'],
        ['http://google.ca:80/test', 'google.ca'],
        ['https://google.ca/test', 'google.ca'],
        ['https://google.ca:443/test', 'google.ca'],
        ['//google.ca/test', 'google.ca'],
        ['//google.ca:80/test', 'google.ca'],
        ['//google.ca:443/test', 'google.ca'],
        ['google.ca/test', 'google.ca'],
        ['google.ca:80/test', 'google.ca'],
        ['google.ca:443/test', 'google.ca'],
        ['http://google.ca/', 'google.ca'],
        ['http://google.ca:80/', 'google.ca'],
        ['https://google.ca/', 'google.ca'],
        ['https://google.ca:443/', 'google.ca'],
        ['//google.ca/', 'google.ca'],
        ['//google.ca:80/', 'google.ca'],
        ['//google.ca:443/', 'google.ca'],
        ['google.ca/', 'google.ca'],
        ['google.ca:80/', 'google.ca'],
        ['google.ca:443/', 'google.ca'],
        ['google.ca', 'google.ca'],
        ['http://google.ca', 'google.ca'],
        ['http://google.ca:80', 'google.ca'],
        ['https://google.ca', 'google.ca'],
        ['https://google.ca:443', 'google.ca'],
        ['//google.ca', 'google.ca'],
        ['//google.ca:80', 'google.ca'],
        ['//google.ca:443', 'google.ca'],
        ['google.ca', 'google.ca'],
        ['google.ca:80', 'google.ca'],
        ['google.ca:443', 'google.ca'],
        ['http://google.Ca/test', 'google.ca'],
        ['http://google.ca:80/test', 'google.ca'],
        ['https://google.Ca/test', 'google.ca'],
        ['https://google.ca:443/test', 'google.ca'],
        ['//google.Ca/test', 'google.ca'],
        ['//google.Ca:80/test', 'google.ca'],
        ['//google.Ca:443/test', 'google.ca'],
        ['google.Ca/test', 'google.ca'],
        ['google.ca:80/test', 'google.ca'],
        ['google.ca:443/test', 'google.ca'],
        ['http://Google.ca/', 'google.ca'],
        ['http://google.Ca:80/', 'google.ca'],
        ['https://Google.ca/', 'google.ca'],
        ['https://google.Ca:443/', 'google.ca'],
        ['//Google.ca/', 'google.ca'],
        ['//google.Ca:80/', 'google.ca'],
        ['//google.Ca:443/', 'google.ca'],
        ['Google.ca/', 'google.ca'],
        ['google.Ca:80/', 'google.ca'],
        ['google.Ca:443/', 'google.ca'],
        ['Google.ca', 'google.ca'],
        ['http://Google.ca', 'google.ca'],
        ['http://google.Ca:80', 'google.ca'],
        ['https://Google.ca', 'google.ca'],
        ['https://google.Ca:443', 'google.ca'],
        ['//Google.ca', 'google.ca'],
        ['//google.Ca:80', 'google.ca'],
        ['//google.Ca:443', 'google.ca'],
        ['Google.ca', 'google.ca'],
        ['google.Ca:80', 'google.ca'],
        ['google.Ca:443', 'google.ca'],
      ].forEach(([domain, hostname]) => {
        expect(Domainlist.parseURL(domain), `domain ${domain} should be parsed as ${hostname}`).to.equal(hostname);
      });
    });
  });

  describe('#match', () => {

    const whiteList = Domainlist.parseList(domainlists['whitelist']);

    it('does match on an included domain', () => {
      [
        'http://wapo.com',
        'nytimes.com'
      ].forEach((domain) => {
        expect(domainlist.match(whiteList, domain)).to.be.true;
      });
    });

    it('does not match on a not included domain', () => {
      [
        'badsite.com',
        'www.badsite.com',
        'otherexample.com'
      ].forEach((domain) => {
        expect(domainlist.match(whiteList, domain)).to.be.false;
      });
    });
  });
});
