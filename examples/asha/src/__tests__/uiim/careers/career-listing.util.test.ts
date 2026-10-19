import { matchesFilters, toCareerHref, uniqueOptions } from '@/components/uiim/careers/career-listing.util';

describe('career listing filters', () => {
  it('builds sorted dropdown options and keeps an All choice', () => {
    expect(uniqueOptions(['Part Time', 'Full Time', 'Full Time', ''])).toEqual([
      'All',
      'Full Time',
      'Part Time',
    ]);
  });

  it('matches a job when every selected dropdown agrees', () => {
    const job = {
      positionType: 'Part Time',
      jobCategory: 'Private Practice',
      state: 'California',
      education: "Master's Degree",
    };

    expect(
      matchesFilters(job, {
        positionType: 'Part Time',
        jobCategory: 'All',
        state: 'California',
        education: 'All',
      })
    ).toBe(true);
    expect(
      matchesFilters(job, {
        positionType: 'Full Time',
        jobCategory: 'All',
        state: 'All',
        education: 'All',
      })
    ).toBe(false);
  });

  it('turns a Sitecore content path into a public careers url', () => {
    expect(toCareerHref('/sitecore/content/asha/asha/Home/Careers/Founding Lead Speech-Language Pathologist')).toBe(
      '/Careers/Founding Lead Speech-Language Pathologist'
    );
  });
});
