async function getLatestVersion(pkg, fallback) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`);
    const data = await res.json();
    return data.version;
  } catch {
    return fallback;
  }
}

export default async function (plop) {
  const oberryVersion = await getLatestVersion('oberry', '1.11.0');

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

