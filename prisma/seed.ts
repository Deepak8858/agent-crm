import { PrismaClient } from '@prisma/client'
import { generateApiKey, hashApiKey } from '../src/lib/api-key'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample companies
  const acmeCorp = await prisma.company.create({
    data: {
      name: 'Acme Corporation',
      industry: 'Technology',
      website: 'https://acme.com',
      phoneNumber: '+1-555-0100',
      address: '123 Tech Street, San Francisco, CA 94105',
      healthScore: 85,
    },
  })

  const techStart = await prisma.company.create({
    data: {
      name: 'TechStart Inc',
      industry: 'Software',
      website: 'https://techstart.io',
      phoneNumber: '+1-555-0200',
      address: '456 Innovation Ave, Austin, TX 73301',
      healthScore: 72,
    },
  })

  console.log('✅ Companies created')

  // Create sample contacts
  const johnDoe = await prisma.contact.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acme.com',
      phoneNumber: '+1-555-0123',
      alternatePhone: '+1-555-0124',
      status: 'PROSPECT',
      tags: ['enterprise', 'decision-maker'],
      communicationConsent: true,
      recordingConsent: true,
      companyId: acmeCorp.id,
      lastInteractionDate: new Date('2024-09-25T10:30:00Z'),
    },
  })

  const janeSmith = await prisma.contact.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@techstart.io',
      phoneNumber: '+1-555-0456',
      status: 'CUSTOMER',
      tags: ['tech-savvy', 'early-adopter'],
      communicationConsent: true,
      recordingConsent: false,
      companyId: techStart.id,
      lastInteractionDate: new Date('2024-09-24T15:45:00Z'),
    },
  })

  const bobJohnson = await prisma.contact.create({
    data: {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      phoneNumber: '+1-555-0789',
      status: 'LEAD',
      tags: ['interested'],
      communicationConsent: true,
      recordingConsent: true,
      lastInteractionDate: new Date('2024-09-26T09:15:00Z'),
    },
  })

  console.log('✅ Contacts created')

  // Create sample deals
  const deal1 = await prisma.deal.create({
    data: {
      name: 'Enterprise Software License',
      amount: 50000,
      stage: 'PROPOSAL',
      probability: 75,
      closeDate: new Date('2024-10-15T00:00:00Z'),
      nextAction: 'Schedule demo with technical team',
      contactId: johnDoe.id,
      companyId: acmeCorp.id,
    },
  })

  const deal2 = await prisma.deal.create({
    data: {
      name: 'Annual Support Contract',
      amount: 12000,
      stage: 'NEGOTIATION',
      probability: 90,
      closeDate: new Date('2024-10-01T00:00:00Z'),
      nextAction: 'Send final contract for signature',
      contactId: janeSmith.id,
      companyId: techStart.id,
    },
  })

  const deal3 = await prisma.deal.create({
    data: {
      name: 'Starter Package',
      amount: 5000,
      stage: 'QUALIFIED',
      probability: 40,
      closeDate: new Date('2024-11-30T00:00:00Z'),
      nextAction: 'Follow up on budget approval',
      contactId: bobJohnson.id,
    },
  })

  console.log('✅ Deals created')

  // Create sample activities
  await prisma.activity.create({
    data: {
      type: 'VOICE_AGENT_CALL',
      subject: 'Discovery Call - Enterprise Requirements',
      summary: 'Discussed technical requirements and integration needs',
      details: 'Customer interested in our enterprise package. Key requirements: SSO integration, API access, custom reporting. Timeline: Q4 implementation.',
      duration: 1800, // 30 minutes
      outcome: 'qualified',
      aiSentiment: 'positive',
      aiIntent: 'purchase_intent',
      followUpRequired: true,
      followUpDate: new Date('2024-09-30T10:00:00Z'),
      contactId: johnDoe.id,
      companyId: acmeCorp.id,
      dealId: deal1.id,
      createdBy: 'VOICE_AGENT',
      completedAt: new Date('2024-09-25T10:30:00Z'),
    },
  })

  await prisma.activity.create({
    data: {
      type: 'CALL',
      subject: 'Support Contract Renewal Discussion',
      summary: 'Reviewed current usage and discussed renewal terms',
      details: 'Customer satisfied with current service level. Interested in upgrading to premium support tier.',
      duration: 900, // 15 minutes
      outcome: 'renewal_interest',
      followUpRequired: true,
      followUpDate: new Date('2024-09-28T14:00:00Z'),
      contactId: janeSmith.id,
      companyId: techStart.id,
      dealId: deal2.id,
      createdBy: 'USER',
      completedAt: new Date('2024-09-24T15:45:00Z'),
    },
  })

  await prisma.activity.create({
    data: {
      type: 'VOICE_AGENT_CALL',
      subject: 'Initial Qualification Call',
      summary: 'First contact to understand business needs',
      details: 'Small business owner looking for cost-effective solution. Budget constraints but interested in starting small.',
      duration: 600, // 10 minutes
      outcome: 'needs_nurturing',
      aiSentiment: 'neutral',
      aiIntent: 'information_gathering',
      followUpRequired: true,
      followUpDate: new Date('2024-10-03T11:00:00Z'),
      contactId: bobJohnson.id,
      dealId: deal3.id,
      createdBy: 'VOICE_AGENT',
      completedAt: new Date('2024-09-26T09:15:00Z'),
    },
  })

  console.log('✅ Activities created')

  // Create sample support tickets
  await prisma.ticket.create({
    data: {
      subject: 'Integration Issue with SSO',
      description: 'Customer unable to configure SAML SSO with their identity provider',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      category: 'Technical',
      contactId: johnDoe.id,
      assignedTo: 'tech-support-1',
      voiceSummary: 'Customer called about SSO configuration issues. Needs urgent resolution for upcoming go-live.',
      aiTags: ['sso', 'integration', 'urgent', 'enterprise'],
    },
  })

  await prisma.ticket.create({
    data: {
      subject: 'Feature Request: Custom Dashboard',
      description: 'Request for custom dashboard widgets and enhanced reporting capabilities',
      status: 'OPEN',
      priority: 'MEDIUM',
      category: 'Feature Request',
      contactId: janeSmith.id,
      voiceSummary: 'Customer interested in custom dashboard features for better data visualization.',
      aiTags: ['dashboard', 'reporting', 'customization', 'enhancement'],
    },
  })

  await prisma.ticket.create({
    data: {
      subject: 'Billing Question',
      description: 'Questions about pricing tiers and upgrade options',
      status: 'RESOLVED',
      priority: 'LOW',
      category: 'Billing',
      contactId: bobJohnson.id,
      assignedTo: 'billing-support',
      voiceSummary: 'Customer had questions about pricing. Provided information about starter vs professional tiers.',
      aiTags: ['billing', 'pricing', 'upgrade', 'information'],
    },
  })

  console.log('✅ Support tickets created')

  // Create sample API keys for voice agent integration
  const { key: voiceAgentKey, prefix: voiceAgentPrefix } = generateApiKey()
  const hashedKey = await hashApiKey(voiceAgentKey)

  await prisma.apiKey.create({
    data: {
      name: 'Voice Agent Production',
      keyHash: hashedKey,
      keyPrefix: voiceAgentPrefix,
      scopes: [
        'contacts:read',
        'contacts:write',
        'activities:write',
        'deals:read',
        'deals:write',
        'tickets:write',
      ],
      isActive: true,
      createdBy: 'SYSTEM',
      usageCount: 156,
      lastUsedAt: new Date('2024-09-26T12:30:00Z'),
    },
  })

  const { key: testKey, prefix: testPrefix } = generateApiKey()
  const hashedTestKey = await hashApiKey(testKey)

  await prisma.apiKey.create({
    data: {
      name: 'Voice Agent Testing',
      keyHash: hashedTestKey,
      keyPrefix: testPrefix,
      scopes: [
        'contacts:read',
        'activities:write',
      ],
      isActive: true,
      createdBy: 'SYSTEM',
      usageCount: 23,
      lastUsedAt: new Date('2024-09-25T16:45:00Z'),
      expiresAt: new Date('2024-12-31T23:59:59Z'),
    },
  })

  console.log('✅ API keys created')
  console.log('')
  console.log('🔑 Generated API Keys (save these securely):')
  console.log(`   Production: ${voiceAgentKey}`)
  console.log(`   Testing: ${testKey}`)

  // Create consent records
  await prisma.consent.createMany({
    data: [
      {
        contactId: johnDoe.id,
        type: 'COMMUNICATION',
        granted: true,
      },
      {
        contactId: johnDoe.id,
        type: 'RECORDING',
        granted: true,
      },
      {
        contactId: janeSmith.id,
        type: 'COMMUNICATION',
        granted: true,
      },
      {
        contactId: janeSmith.id,
        type: 'RECORDING',
        granted: false,
      },
      {
        contactId: bobJohnson.id,
        type: 'COMMUNICATION',
        granted: true,
      },
      {
        contactId: bobJohnson.id,
        type: 'RECORDING',
        granted: true,
      },
    ],
  })

  console.log('✅ Consent records created')

  // Create audit logs
  await prisma.auditLog.createMany({
    data: [
      {
        actor: 'VOICE_AGENT',
        action: 'CREATE_ACTIVITY',
        entity: 'Activity',
        entityId: '1',
        changes: {
          type: 'VOICE_AGENT_CALL',
          contactId: johnDoe.id,
          duration: 1800,
        },
      },
      {
        actor: 'USER',
        action: 'UPDATE_DEAL',
        entity: 'Deal',
        entityId: deal1.id,
        changes: {
          stage: 'PROPOSAL',
          probability: 75,
        },
      },
      {
        actor: 'VOICE_AGENT',
        action: 'CREATE_TICKET',
        entity: 'Ticket',
        entityId: '1',
        changes: {
          subject: 'Integration Issue with SSO',
          priority: 'HIGH',
        },
      },
    ],
  })

  console.log('✅ Audit logs created')
  console.log('')
  console.log('🎉 Database seeding completed successfully!')
  console.log('')
  console.log('📊 Summary:')
  console.log('   • 2 Companies')
  console.log('   • 3 Contacts')  
  console.log('   • 3 Deals')
  console.log('   • 3 Activities')
  console.log('   • 3 Support Tickets')
  console.log('   • 2 API Keys')
  console.log('   • 6 Consent Records')
  console.log('   • 3 Audit Logs')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })