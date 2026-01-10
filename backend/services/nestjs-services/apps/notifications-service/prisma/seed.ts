import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const templates = [
    // Project
    {{
      code: 'project_created',
      event_type: 'PROJECT_CREATED',
      title_template: '{{actorName}} created project "{{projectName}}"',
      body_template: 'A new project has been created.',
      category: 'project',
    },
        ];

  for (const template of templates) {
    await prisma.notificationTemplate.upsert({
      where: { code: template.code },
      update: template,
      create: template,
    });
  }

  console.log(`Seeded ${templates.length} notification templates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());