import { Injectable } from '@nestjs/common';
import { Seeder } from './seeder.interface';
import { PrismaService } from "../../prisma.service";
import { OutcomeStatus } from "../../generated/prisma-client";
import appConfig from "@app/common/config/app.config";

@Injectable()
export class OutcomesSeeder implements Seeder {
  constructor(private readonly prisma: PrismaService) {}

  async run(): Promise<void> {
    const userId = appConfig().sample_data.users.test_user.id;

    console.log('📝 Seeding outcomes with drivers and actions...');

    // Outcome 1: Product Launch
    const outcome1 = await this.prisma.outcome.create({
      data: {
        user_id: userId,
        title: 'Launch new product feature to 1000 beta users',
        why_it_matters: 'Validate market demand and collect user feedback before full rollout',
        deadline: new Date('2025-04-15'),
        status: OutcomeStatus.ACTIVE,
        drivers: {
          create: [
            {
              user_id: userId,
              title: 'Complete feature development',
              description: 'Build and test all core functionality',
              position: 1,
            },
            {
              user_id: userId,
              title: 'Set up production infrastructure',
              description: 'Ensure scalable, reliable deployment environment',
              position: 2,
            },
            {
              user_id: userId,
              title: 'Plan and execute beta user recruitment',
              description: 'Identify and onboard early adopters',
              position: 3,
            },
          ],
        },
        success_metrics: {
          create: [
            {
              metric_name: 'Beta users onboarded',
              target_value: 1000,
              current_value: 450,
              unit: 'users',
              description: 'Active beta users testing the new feature',
            },
          ],
        },
      },
      include: { drivers: true },
    });

    // Add actions for outcome 1
    await this.prisma.action.createMany({
      data: [
        {
          driver_id: outcome1.drivers[0].id,
          outcome_id: outcome1.id,
          user_id: userId,
          title: 'Finalize API endpoints and documentation',
          description: 'Complete REST API with comprehensive OpenAPI docs',
          position: 1,
          is_completed: true,
          completed_at: new Date('2025-01-05'),
        },
        {
          driver_id: outcome1.drivers[0].id,
          outcome_id: outcome1.id,
          user_id: userId,
          title: 'Build user interface components',
          description: 'Create reusable components with accessibility standards',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-01-18'),
        },
        {
          driver_id: outcome1.drivers[0].id,
          outcome_id: outcome1.id,
          user_id: userId,
          title: 'Conduct end-to-end testing across browsers',
          description: 'Test on Chrome, Firefox, Safari, and mobile devices',
          position: 3,
          is_completed: false,
          scheduled_for: new Date('2025-02-01'),
        },
        {
          driver_id: outcome1.drivers[1].id,
          outcome_id: outcome1.id,
          user_id: userId,
          title: 'Configure auto-scaling groups',
          description: 'Set up horizontal scaling based on traffic patterns',
          position: 1,
          is_completed: true,
          completed_at: new Date('2025-01-10'),
        },
        {
          driver_id: outcome1.drivers[1].id,
          outcome_id: outcome1.id,
          user_id: userId,
          title: 'Implement monitoring and alerting',
          description: 'Set up dashboards for latency, errors, and resource usage',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-01-25'),
        },
        {
          driver_id: outcome1.drivers[2].id,
          outcome_id: outcome1.id,
          user_id: userId,
          title: 'Create beta signup landing page',
          description: 'Design compelling copy and capture leads',
          position: 1,
          is_completed: false,
          scheduled_for: new Date('2025-02-15'),
        },
        {
          driver_id: outcome1.drivers[2].id,
          outcome_id: outcome1.id,
          user_id: userId,
          title: 'Launch targeted social media campaign',
          description: 'Reach potential beta users on LinkedIn and Twitter',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-03-01'),
        },
      ],
    });
    console.log('✅ Created: "Launch new product feature" with 3 drivers and 7 actions');

    // Outcome 2: Career Development
    const outcome2 = await this.prisma.outcome.create({
      data: {
        user_id: userId,
        title: 'Get promoted to senior engineering role',
        why_it_matters: 'Increase impact, compensation, and leadership responsibilities',
        deadline: new Date('2025-06-30'),
        status: OutcomeStatus.ACTIVE,
        drivers: {
          create: [
            {
              user_id: userId,
              title: 'Demonstrate technical leadership',
              description: 'Lead high-impact projects and mentor team members',
              position: 1,
            },
            {
              user_id: userId,
              title: 'Build cross-functional relationships',
              description: 'Collaborate effectively with product and design teams',
              position: 2,
            },
          ],
        },
        success_metrics: {
          create: [
            {
              metric_name: 'Promotion achieved',
              target_value: 1,
              current_value: 0,
              unit: 'promotion',
              description: 'Successfully promoted to senior engineering role',
            },
          ],
        },
      },
      include: { drivers: true },
    });

    await this.prisma.action.createMany({
      data: [
        {
          driver_id: outcome2.drivers[0].id,
          outcome_id: outcome2.id,
          user_id: userId,
          title: 'Lead architecture design for Q1 initiative',
          description: 'Drive technical decisions for major system redesign',
          position: 1,
          is_completed: false,
          scheduled_for: new Date('2025-01-20'),
        },
        {
          driver_id: outcome2.drivers[0].id,
          outcome_id: outcome2.id,
          user_id: userId,
          title: 'Mentor 2 junior engineers through code reviews',
          description: 'Provide weekly feedback and pair programming sessions',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-01-15'),
        },
        {
          driver_id: outcome2.drivers[0].id,
          outcome_id: outcome2.id,
          user_id: userId,
          title: 'Present technical talks at 2 team meetings',
          description: 'Share knowledge on best practices and new technologies',
          position: 3,
          is_completed: false,
          scheduled_for: new Date('2025-02-01'),
        },
        {
          driver_id: outcome2.drivers[1].id,
          outcome_id: outcome2.id,
          user_id: userId,
          title: 'Schedule monthly 1-on-1s with product managers',
          description: 'Understand roadmap priorities and provide technical input',
          position: 1,
          is_completed: false,
          scheduled_for: new Date('2025-01-15'),
        },
        {
          driver_id: outcome2.drivers[1].id,
          outcome_id: outcome2.id,
          user_id: userId,
          title: 'Participate in design critique sessions',
          description: 'Provide engineering perspective on feasibility',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-01-22'),
        },
      ],
    });
    console.log('✅ Created: "Get promoted to senior engineering role" with 2 drivers and 5 actions');

    // Outcome 3: Business Revenue Goal
    const outcome3 = await this.prisma.outcome.create({
      data: {
        user_id: userId,
        title: 'Reach $50K monthly recurring revenue',
        why_it_matters: 'Achieve financial sustainability and fund team expansion',
        deadline: new Date('2025-09-30'),
        status: OutcomeStatus.ACTIVE,
        drivers: {
          create: [
            {
              user_id: userId,
              title: 'Acquire 25 new enterprise customers',
              description: 'Target mid-market companies with $2K average contract value',
              position: 1,
            },
            {
              user_id: userId,
              title: 'Increase average contract value to $2.5K',
              description: 'Upsell existing customers and improve packaging',
              position: 2,
            },
            {
              user_id: userId,
              title: 'Reduce monthly churn to under 3%',
              description: 'Improve customer retention and lifetime value',
              position: 3,
            },
          ],
        },
        success_metrics: {
          create: [
            {
              metric_name: 'Monthly recurring revenue',
              target_value: 50000,
              current_value: 28500,
              unit: 'USD',
              description: 'Total monthly recurring revenue from all customers',
            },
          ],
        },
      },
      include: { drivers: true },
    });

    await this.prisma.action.createMany({
      data: [
        {
          driver_id: outcome3.drivers[0].id,
          outcome_id: outcome3.id,
          user_id: userId,
          title: 'Build qualified lead list of 200 companies',
          description: 'Research companies matching ideal customer profile',
          position: 1,
          is_completed: true,
          completed_at: new Date('2025-01-08'),
        },
        {
          driver_id: outcome3.drivers[0].id,
          outcome_id: outcome3.id,
          user_id: userId,
          title: 'Launch outbound email campaign',
          description: 'Send personalized sequences to decision makers',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-01-22'),
        },
        {
          driver_id: outcome3.drivers[0].id,
          outcome_id: outcome3.id,
          user_id: userId,
          title: 'Book 50 discovery calls',
          description: 'Qualify prospects and understand their pain points',
          position: 3,
          is_completed: false,
          scheduled_for: new Date('2025-02-15'),
        },
        {
          driver_id: outcome3.drivers[1].id,
          outcome_id: outcome3.id,
          user_id: userId,
          title: 'Analyze usage patterns of top customers',
          description: 'Identify upsell opportunities based on behavior',
          position: 1,
          is_completed: false,
          scheduled_for: new Date('2025-02-01'),
        },
        {
          driver_id: outcome3.drivers[1].id,
          outcome_id: outcome3.id,
          user_id: userId,
          title: 'Create premium tier with advanced features',
          description: 'Design and price enterprise package',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-03-01'),
        },
        {
          driver_id: outcome3.drivers[2].id,
          outcome_id: outcome3.id,
          user_id: userId,
          title: 'Implement customer health scoring',
          description: 'Track engagement metrics to identify at-risk accounts',
          position: 1,
          is_completed: false,
          scheduled_for: new Date('2025-02-10'),
        },
        {
          driver_id: outcome3.drivers[2].id,
          outcome_id: outcome3.id,
          user_id: userId,
          title: 'Launch proactive customer success program',
          description: 'Regular check-ins and best practices workshops',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-03-15'),
        },
      ],
    });
    console.log('✅ Created: "Reach $50K monthly recurring revenue" with 3 drivers and 7 actions');

    // Outcome 4: Personal Fitness Goal
    const outcome4 = await this.prisma.outcome.create({
      data: {
        user_id: userId,
        title: 'Run a half marathon in under 2 hours',
        why_it_matters: 'Improve health, build discipline, and achieve personal milestone',
        deadline: new Date('2025-05-18'),
        status: OutcomeStatus.ACTIVE,
        drivers: {
          create: [
            {
              user_id: userId,
              title: 'Build endurance base',
              description: 'Gradually increase weekly mileage without injury',
              position: 1,
            },
            {
              user_id: userId,
              title: 'Improve running speed and efficiency',
              description: 'Train at target race pace and faster',
              position: 2,
            },
            {
              user_id: userId,
              title: 'Prevent injuries and support recovery',
              description: 'Strength training, stretching, and proper nutrition',
              position: 3,
            },
          ],
        },
        success_metrics: {
          create: [
            {
              metric_name: 'Half marathon finish time',
              target_value: 120,
              current_value: 0,
              unit: 'minutes',
              description: 'Complete half marathon in under 2 hours',
            },
          ],
        },
      },
      include: { drivers: true },
    });

    await this.prisma.action.createMany({
      data: [
        {
          driver_id: outcome4.drivers[0].id,
          outcome_id: outcome4.id,
          user_id: userId,
          title: 'Complete 4 runs per week (20 miles total)',
          description: 'Mix of easy runs, tempo runs, and long runs',
          position: 1,
          is_completed: false,
          scheduled_for: new Date('2025-01-14'),
        },
        {
          driver_id: outcome4.drivers[0].id,
          outcome_id: outcome4.id,
          user_id: userId,
          title: 'Increase long run distance by 1 mile every 2 weeks',
          description: 'Build up to 12-mile long run by race day',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-01-21'),
        },
        {
          driver_id: outcome4.drivers[1].id,
          outcome_id: outcome4.id,
          user_id: userId,
          title: 'Do weekly tempo runs at 9:00 min/mile pace',
          description: 'Build lactate threshold and race-pace endurance',
          position: 1,
          is_completed: false,
          scheduled_for: new Date('2025-01-17'),
        },
        {
          driver_id: outcome4.drivers[1].id,
          outcome_id: outcome4.id,
          user_id: userId,
          title: 'Complete interval training sessions',
          description: '800m repeats at 8:30 min/mile with recovery',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-01-24'),
        },
        {
          driver_id: outcome4.drivers[2].id,
          outcome_id: outcome4.id,
          user_id: userId,
          title: 'Strength train 2x per week',
          description: 'Focus on core, glutes, and leg strength',
          position: 1,
          is_completed: false,
          scheduled_for: new Date('2025-01-16'),
        },
        {
          driver_id: outcome4.drivers[2].id,
          outcome_id: outcome4.id,
          user_id: userId,
          title: 'Foam roll and stretch daily',
          description: '15-minute recovery routine after runs',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-01-13'),
        },
      ],
    });
    console.log('✅ Created: "Run a half marathon in under 2 hours" with 3 drivers and 6 actions');

    // Outcome 5: Content Creation Goal
    const outcome5 = await this.prisma.outcome.create({
      data: {
        user_id: userId,
        title: 'Build audience of 10,000 newsletter subscribers',
        why_it_matters: 'Create sustainable distribution channel for product launches',
        deadline: new Date('2025-08-31'),
        status: OutcomeStatus.ACTIVE,
        drivers: {
          create: [
            {
              user_id: userId,
              title: 'Publish consistent, high-quality content',
              description: 'Build trust and provide value to grow organically',
              position: 1,
            },
            {
              user_id: userId,
              title: 'Optimize signup conversion',
              description: 'Improve landing page and lead magnets',
              position: 2,
            },
            {
              user_id: userId,
              title: 'Amplify reach through partnerships',
              description: 'Collaborate with complementary creators',
              position: 3,
            },
          ],
        },
        success_metrics: {
          create: [
            {
              metric_name: 'Newsletter subscribers',
              target_value: 10000,
              current_value: 3250,
              unit: 'subscribers',
              description: 'Total email subscribers to newsletter',
            },
          ],
        },
      },
      include: { drivers: true },
    });

    await this.prisma.action.createMany({
      data: [
        {
          driver_id: outcome5.drivers[0].id,
          outcome_id: outcome5.id,
          user_id: userId,
          title: 'Write and publish 2 newsletter issues per week',
          description: 'Focus on actionable insights and storytelling',
          position: 1,
          is_completed: false,
          scheduled_for: new Date('2025-01-15'),
        },
        {
          driver_id: outcome5.drivers[0].id,
          outcome_id: outcome5.id,
          user_id: userId,
          title: 'Create content calendar for next 3 months',
          description: 'Plan topics aligned with audience interests',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-01-20'),
        },
        {
          driver_id: outcome5.drivers[1].id,
          outcome_id: outcome5.id,
          user_id: userId,
          title: 'Create compelling lead magnet (free guide/template)',
          description: 'Offer immediate value in exchange for email',
          position: 1,
          is_completed: false,
          scheduled_for: new Date('2025-02-01'),
        },
        {
          driver_id: outcome5.drivers[1].id,
          outcome_id: outcome5.id,
          user_id: userId,
          title: 'A/B test signup page headlines and CTAs',
          description: 'Improve conversion rate from 2% to 5%',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-02-15'),
        },
        {
          driver_id: outcome5.drivers[2].id,
          outcome_id: outcome5.id,
          user_id: userId,
          title: 'Identify 10 potential newsletter cross-promotion partners',
          description: 'Find creators with similar audience size and values',
          position: 1,
          is_completed: false,
          scheduled_for: new Date('2025-03-01'),
        },
        {
          driver_id: outcome5.drivers[2].id,
          outcome_id: outcome5.id,
          user_id: userId,
          title: 'Execute 5 newsletter swaps',
          description: 'Feature each other to tap into new audiences',
          position: 2,
          is_completed: false,
          scheduled_for: new Date('2025-04-01'),
        },
      ],
    });
    console.log('✅ Created: "Build audience of 10,000 newsletter subscribers" with 3 drivers and 6 actions');

    // Outcome 6: Completed Example
    const outcome6 = await this.prisma.outcome.create({
      data: {
        user_id: userId,
        title: 'Migrate legacy system to microservices',
        why_it_matters: 'Reduce technical debt and enable faster development',
        deadline: new Date('2024-12-31'),
        status: OutcomeStatus.COMPLETED,
        completed_at: new Date('2024-12-28'),
        drivers: {
          create: [
            {
              user_id: userId,
              title: 'Extract user service from monolith',
              description: 'Separate authentication and user management',
              position: 1,
            },
          ],
        },
        success_metrics: {
          create: [
            {
              metric_name: 'Migration completion',
              target_value: 100,
              current_value: 100,
              unit: 'percent',
              description: 'Percentage of system migrated to microservices',
            },
          ],
        },
      },
      include: { drivers: true },
    });

    await this.prisma.action.createMany({
      data: [
        {
          driver_id: outcome6.drivers[0].id,
          outcome_id: outcome6.id,
          user_id: userId,
          title: 'Design microservice API contracts',
          description: 'Define clear boundaries and interfaces',
          position: 1,
          is_completed: true,
          completed_at: new Date('2024-11-15'),
        },
        {
          driver_id: outcome6.drivers[0].id,
          outcome_id: outcome6.id,
          user_id: userId,
          title: 'Deploy user service to production',
          description: 'Complete migration with zero downtime',
          position: 2,
          is_completed: true,
          completed_at: new Date('2024-12-15'),
        },
      ],
    });
    console.log('✅ Created: "Migrate legacy system to microservices" (COMPLETED) with 1 driver and 2 actions');

    // Outcome 7: Parked Example
    const outcome7 = await this.prisma.outcome.create({
      data: {
        user_id: userId,
        title: 'Launch mobile app for iOS and Android',
        why_it_matters: 'Expand to mobile-first user segment',
        deadline: new Date('2025-12-31'),
        status: OutcomeStatus.PARKED,
        drivers: {
          create: [
            {
              user_id: userId,
              title: 'Research mobile frameworks',
              description: 'Evaluate technology options',
              position: 1,
            },
          ],
        },
        success_metrics: {
          create: [
            {
              metric_name: 'App downloads',
              target_value: 10000,
              current_value: 0,
              unit: 'downloads',
              description: 'Total app downloads across iOS and Android',
            },
          ],
        },
      },
      include: { drivers: true },
    });

    await this.prisma.action.createMany({
      data: [
        {
          driver_id: outcome7.drivers[0].id,
          outcome_id: outcome7.id,
          user_id: userId,
          title: 'Evaluate React Native vs Flutter',
          description: 'Compare developer experience and performance',
          position: 1,
          is_completed: false,
        },
        {
          driver_id: outcome7.drivers[0].id,
          outcome_id: outcome7.id,
          user_id: userId,
          title: 'Build proof-of-concept for each framework',
          description: 'Test key features and integrations',
          position: 2,
          is_completed: false,
        },
      ],
    });
    console.log('✅ Created: "Launch mobile app for iOS and Android" (PARKED) with 1 driver and 2 actions');

    console.log('\n✅ All outcomes seeded successfully!');
  }

  async clear(): Promise<void> {
    console.log('🗑️  Clearing outcomes data...');

    // Delete in correct order due to foreign key constraints
    await this.prisma.action.deleteMany();
    console.log('  ✓ Cleared actions');

    await this.prisma.driver.deleteMany();
    console.log('  ✓ Cleared drivers');

    await this.prisma.successMetric.deleteMany();
    console.log('  ✓ Cleared success metrics');

    await this.prisma.outcome.deleteMany();
    console.log('  ✓ Cleared outcomes');

    console.log('✅ All outcomes data cleared');
  }
}