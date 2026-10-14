import { IGQLImageField, IGQLTextField, IGQLLinkField, IGQLRichTextField } from '@/lib/component-props';

export const defaultTeamSectionProps = {
  params: {
    styles: '',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            {
              id: 'team-1',
              image: {
                jsonValue: {
                  value: {
                    src: '/images/team-1.jpg',
                    alt: 'Team Member 1',
                    width: 300,
                    height: 300,
                  },
                },
              } as IGQLImageField,
              fullName: {
                jsonValue: {
                  value: 'John Doe',
                },
              } as IGQLTextField,
              jobTitle: {
                jsonValue: {
                  value: 'CEO',
                },
              } as IGQLTextField,
              description: {
                jsonValue: {
                  value: '<p>Experienced leader with 10+ years in the industry.</p>',
                },
              } as IGQLRichTextField,
              facebook: {
                jsonValue: {
                  value: {
                    href: 'https://facebook.com/johndoe',
                    text: 'Facebook',
                    title: 'John Doe Facebook',
                  },
                },
              } as IGQLLinkField,
              instagram: {
                jsonValue: {
                  value: {
                    href: 'https://instagram.com/johndoe',
                    text: 'Instagram',
                    title: 'John Doe Instagram',
                  },
                },
              } as IGQLLinkField,
              linkedIn: {
                jsonValue: {
                  value: {
                    href: 'https://linkedin.com/in/johndoe',
                    text: 'LinkedIn',
                    title: 'John Doe LinkedIn',
                  },
                },
              } as IGQLLinkField,
              twitterX: {
                jsonValue: {
                  value: {
                    href: 'https://twitter.com/johndoe',
                    text: 'Twitter',
                    title: 'John Doe Twitter',
                  },
                },
              } as IGQLLinkField,
            },
            {
              id: 'team-2',
              image: {
                jsonValue: {
                  value: {
                    src: '/images/team-2.jpg',
                    alt: 'Team Member 2',
                    width: 300,
                    height: 300,
                  },
                },
              } as IGQLImageField,
              fullName: {
                jsonValue: {
                  value: 'Jane Smith',
                },
              } as IGQLTextField,
              jobTitle: {
                jsonValue: {
                  value: 'CTO',
                },
              } as IGQLTextField,
              description: {
                jsonValue: {
                  value: '<p>Technical expert with a passion for innovation.</p>',
                },
              } as IGQLRichTextField,
              facebook: {
                jsonValue: {
                  value: {
                    href: '',
                    text: '',
                    title: '',
                  },
                },
              } as IGQLLinkField,
              instagram: {
                jsonValue: {
                  value: {
                    href: '',
                    text: '',
                    title: '',
                  },
                },
              } as IGQLLinkField,
              linkedIn: {
                jsonValue: {
                  value: {
                    href: 'https://linkedin.com/in/janesmith',
                    text: 'LinkedIn',
                    title: 'Jane Smith LinkedIn',
                  },
                },
              } as IGQLLinkField,
              twitterX: {
                jsonValue: {
                  value: {
                    href: '',
                    text: '',
                    title: '',
                  },
                },
              } as IGQLLinkField,
            },
          ],
        },
        tagLine: {
          jsonValue: {
            value: 'Our Team',
          },
        } as IGQLTextField,
        heading: {
          jsonValue: {
            value: 'Meet the Experts',
          },
        } as IGQLTextField,
        text: {
          jsonValue: {
            value: '<p>Get to know the talented individuals behind our success.</p>',
          },
        } as IGQLTextField,
        heading2: {
          jsonValue: {
            value: 'Join Our Team',
          },
        } as IGQLTextField,
        text2: {
          jsonValue: {
            value: '<p>We are always looking for talented individuals to join our team.</p>',
          },
        } as IGQLTextField,
        link: {
          jsonValue: {
            value: {
              href: '/careers',
              text: 'View Careers',
              title: 'View Careers',
            },
          },
        } as IGQLLinkField,
      },
    },
  },
};

export const teamSectionPropsWithStyles = {
  ...defaultTeamSectionProps,
  params: {
    styles: 'custom-team-class',
  },
};

export const teamSectionPropsNoTeam = {
  params: {
    styles: '',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [],
        },
        tagLine: {
          jsonValue: {
            value: 'No Team',
          },
        } as IGQLTextField,
        heading: {
          jsonValue: {
            value: 'No Team Members',
          },
        } as IGQLTextField,
        text: {
          jsonValue: {
            value: '<p>No team members available.</p>',
          },
        } as IGQLTextField,
        heading2: {
          jsonValue: {
            value: 'Join Us',
          },
        } as IGQLTextField,
        text2: {
          jsonValue: {
            value: '<p>We are hiring.</p>',
          },
        } as IGQLTextField,
        link: {
          jsonValue: {
            value: {
              href: '',
              text: '',
              title: '',
            },
          },
        } as IGQLLinkField,
      },
    },
  },
};

export const teamSectionPropsMinimal = {
  params: {
    styles: '',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            {
              id: 'team-minimal',
              image: {
                jsonValue: {
                  value: {
                    src: '/images/team-minimal.jpg',
                    alt: 'Team Member Minimal',
                    width: 200,
                    height: 200,
                  },
                },
              } as IGQLImageField,
              fullName: {
                jsonValue: {
                  value: 'Basic Member',
                },
              } as IGQLTextField,
              jobTitle: {
                jsonValue: {
                  value: 'Member',
                },
              } as IGQLTextField,
              description: {
                jsonValue: {
                  value: '<p>Experienced professional.</p>',
                },
              } as IGQLRichTextField,
              facebook: {
                jsonValue: {
                  value: {
                    href: '',
                    text: '',
                    title: '',
                  },
                },
              } as IGQLLinkField,
              instagram: {
                jsonValue: {
                  value: {
                    href: '',
                    text: '',
                    title: '',
                  },
                },
              } as IGQLLinkField,
              linkedIn: {
                jsonValue: {
                  value: {
                    href: '',
                    text: '',
                    title: '',
                  },
                },
              } as IGQLLinkField,
              twitterX: {
                jsonValue: {
                  value: {
                    href: '',
                    text: '',
                    title: '',
                  },
                },
              } as IGQLLinkField,
            },
          ],
        },
        tagLine: {
          jsonValue: {
            value: 'Basic Team',
          },
        } as IGQLTextField,
        heading: {
          jsonValue: {
            value: 'Simple Team',
          },
        } as IGQLTextField,
        text: {
          jsonValue: {
            value: '<p>Basic team content.</p>',
          },
        } as IGQLTextField,
        heading2: {
          jsonValue: {
            value: 'Basic Careers',
          },
        } as IGQLTextField,
        text2: {
          jsonValue: {
            value: '<p>Basic careers content.</p>',
          },
        } as IGQLTextField,
        link: {
          jsonValue: {
            value: {
              href: '/basic-careers',
              text: 'Basic Careers',
              title: 'Basic Careers',
            },
          },
        } as IGQLLinkField,
      },
    },
  },
};
