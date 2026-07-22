async function getLatestVersion(pkg) {
  const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`);

  if (!res.ok) {
    throw new Error(`Failed to fetch ${pkg}: ${res.status}`);
  }

  const data = await res.json();
  return data.version;
}

export default async function (plop) {
  let oberryVersion;
  try {
    oberryVersion = await getLatestVersion('oberry');
  } catch (err) {
    console.error('Error fetching oBerry version:', err);
    return;
  }

  plop.setGenerator('project', {
    description: 'oBerry template',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Project name?',
        validate: value => {
          if (value.trim() !== '') return true;
          return 'name is required';
        },
      },
      {
        type: 'list',
        name: 'language',
        message: 'Which language would you like to use?',
        choices: ['TypeScript', 'JavaScript'],
        default: 'TypeScript',
      }
    ],
    actions: data => {
      const templateBase = `templates/${data.language}`;

      return [
        {
          type: 'addMany',
          destination: '{{dashCase name}}',
          base: templateBase,
          templateFiles: `${templateBase}/**`,
          globOptions: { dot: true },
          data: { oberryVersion },
          skipIfExists: true
        }
      ];
    }
  });
}

