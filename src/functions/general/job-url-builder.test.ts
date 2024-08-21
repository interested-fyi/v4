import jobUrlBuilder from './job-url-builder';

describe('jobUrlBuilder', () => {
  const newSource = 'interestedfyi';

  function compareUrls(result: string, expected: string) {
    const resultUrl = new URL(result);
    const expectedUrl = new URL(expected);

    expect(resultUrl.origin).toBe(expectedUrl.origin);
    expect(resultUrl.pathname).toBe(expectedUrl.pathname);

    const resultParams = resultUrl.searchParams;
    const expectedParams = expectedUrl.searchParams;

    expectedParams.forEach((value, key) => {
        expect(resultParams.get(key)).toBe(value);
    })
  }

  it('should set gh_src for greenhouse URLs', () => {
    const url = 'https://job-boards.greenhouse.io/eigenlabs/jobs/4451683005?source=web3.career&gh_src=web3.career#application_form';
    const result = jobUrlBuilder(url, newSource);
    const expected = 'https://job-boards.greenhouse.io/eigenlabs/jobs/4451683005?source=interestedfyi&gh_src=interestedfyi&utm_source=interestedfyi&utm_medium=referral#application_form';
    compareUrls(result, expected);
  });

  it('should set params for greenhouse URLs without existing params', () => {
    const url1 = 'https://boards.greenhouse.io/underdogfantasy/jobs/4296548005';
    const result1 = jobUrlBuilder(url1, newSource);
    const expected1 = 'https://boards.greenhouse.io/underdogfantasy/jobs/4296548005?gh_src=interestedfyi&utm_source=interestedfyi&utm_medium=referral';

    const url2 = 'https://job-boards.greenhouse.io/eigenlabs/jobs/4399904005';
    const result2 = jobUrlBuilder(url2, newSource);
    const expected2 = 'https://job-boards.greenhouse.io/eigenlabs/jobs/4399904005?gh_src=interestedfyi&utm_source=interestedfyi&utm_medium=referral';

    compareUrls(result1, expected1);
    compareUrls(result2, expected2);
  });

  it('should set lever.co for lever URLs', () => {
    const url = 'https://jobs.lever.co/diamondfoundry/ba9a9b5d-57c8-4291-905a-f6429046f560/apply?&rid=RNzYuMjE2LjIzNS44NA==&ref=remoteok.com';
    const result = jobUrlBuilder(url, newSource);
    const expected = 'https://jobs.lever.co/diamondfoundry/ba9a9b5d-57c8-4291-905a-f6429046f560/apply?rid=RNzYuMjE2LjIzNS44NA==&ref=interestedfyi&utm_source=interestedfyi&utm_medium=referral&lever-source=interestedfyi';
    compareUrls(result, expected);
  });

  it('should set source parameter if present', () => {
    const url = 'https://tally.so/r/mJ2yKd?position=Senior%20Fullstack%20Developer&source=remoteok&rid=RNzYuMjE2LjIzNS44NA==&ref=remoteok.com';
    const result = jobUrlBuilder(url, newSource);
    const expected = 'https://tally.so/r/mJ2yKd?position=Senior%20Fullstack%20Developer&source=interestedfyi&rid=RNzYuMjE2LjIzNS44NA==&ref=interestedfyi&utm_source=interestedfyi&utm_medium=referral';
    compareUrls(result, expected);
  });

  it('should set ref parameter if present', () => {
    const url = 'https://applicantai.com/tarjimly/senior-engineer/790?ref=remoteok&rid=RNzYuMjE2LjIzNS44NA==&utm_source=remoteok.com#apply';
    const result = jobUrlBuilder(url, newSource);
    const expected = 'https://applicantai.com/tarjimly/senior-engineer/790?ref=interestedfyi&rid=RNzYuMjE2LjIzNS44NA==&utm_source=interestedfyi&utm_medium=referral#apply';
    compareUrls(result, expected);
  });

  it('should add utm_source and utm_medium if not present', () => {
    const url = 'https://boards.greenhouse.io/capco/jobs/6152381';
    const result = jobUrlBuilder(url, newSource);
    const expected = 'https://boards.greenhouse.io/capco/jobs/6152381?gh_src=interestedfyi&utm_source=interestedfyi&utm_medium=referral';
    compareUrls(result, expected);
  });

  it('should handle multiple parameters', () => {
    const url = 'https://job-boards.greenhouse.io/bitpanda/jobs/4364551101?source=web3.career&gh_src=web3.career#application_form';
    const result = jobUrlBuilder(url, newSource);
    const expected = 'https://job-boards.greenhouse.io/bitpanda/jobs/4364551101?source=interestedfyi&gh_src=interestedfyi&utm_source=interestedfyi&utm_medium=referral#application_form';
    compareUrls(result, expected);
  });

  it('should handle many different urls', () => {
    const url1 = 'https://jobs.ashbyhq.com/conduit/f29d7d87-126d-451c-b91c-0b4eeb7b4909?utm_source=ziprecruiter'
    const result1 = jobUrlBuilder(url1, newSource);
    const expected1 = 'https://jobs.ashbyhq.com/conduit/f29d7d87-126d-451c-b91c-0b4eeb7b4909?utm_source=interestedfyi&utm_medium=referral'
    compareUrls(result1, expected1);

    const url2 = 'https://mpatime.bamboohr.com/careers/32?source=aWQ9MTc%3D&utm_medium=referral&utm_source=idealist'
    const result2 = jobUrlBuilder(url2, newSource);
    const expected2 = 'https://mpatime.bamboohr.com/careers/32?source=interestedfyi&utm_medium=referral&utm_source=interestedfyi'
    compareUrls(result2, expected2);

    const url3 = 'https://jobs.lever.co/polymerlabs/adedbf61-e8f5-4e16-a7f2-053217784453/apply?ref=crypto-careers.com'
    const result3 = jobUrlBuilder(url3, newSource);
    const expected3 = 'https://jobs.lever.co/polymerlabs/adedbf61-e8f5-4e16-a7f2-053217784453/apply?ref=interestedfyi&lever-source=interestedfyi&utm_source=interestedfyi&utm_medium=referral'
    compareUrls(result3, expected3);

    const url4 = 'https://applicantai.com/joi-studio/senior-back-end-wizard/940?ref=remoteok?utm_source=remoteok.com&rid=RNzYuMjE2LjIzNS44NA==&ref=remoteok.com#apply'
    const result4 = jobUrlBuilder(url4, newSource);
    const expected4 = 'https://applicantai.com/joi-studio/senior-back-end-wizard/940?ref=interestedfyi&utm_source=interestedfyi&rid=RNzYuMjE2LjIzNS44NA==&ref=interestedfyi#apply'
    compareUrls(result4, expected4);

    const url5 = 'https://boards.greenhouse.io/cakedefi/jobs/4562161004?ref=web3jobs.io#app'
    const result5 = jobUrlBuilder(url5, newSource);
    const expected5 = 'https://boards.greenhouse.io/cakedefi/jobs/4562161004?ref=interestedfyi&gh_src=interestedfyi&utm_source=interestedfyi&utm_medium=referral#app'
    compareUrls(result5, expected5);
  });
});