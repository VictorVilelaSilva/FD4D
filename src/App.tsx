import React from 'react'
import { AppLayout } from './components/Layout/AppLayout'
import { toolRegistry, createTool } from './tools/registry'
import { CPFGenerator } from './tools/CPFGenerator/CPFGenerator'
import { CNPJGenerator } from './tools/CNPJGenerator/CNPJGenerator'
import { UUIDGenerator } from './tools/UUIDGenerator/UUIDGenerator'
import { CPFValidator } from './tools/CPFValidator/CPFValidator'
import { CNPJValidator } from './tools/CNPJValidator/CNPJValidator'
import { WebhookListener } from './tools/WebhookListener/WebhookListener'

// Register all tools
toolRegistry.registerMany([
  createTool({
    id: 'cpf-generator',
    name: 'CPF Generator',
    description: 'Generate valid Brazilian CPF numbers',
    icon: '🇧🇷',
    category: 'generator',
    component: CPFGenerator,
    tags: ['cpf', 'brazil', 'document', 'id'],
  }),
  createTool({
    id: 'cnpj-generator',
    name: 'CNPJ Generator',
    description: 'Generate valid Brazilian CNPJ numbers',
    icon: '🏢',
    category: 'generator',
    component: CNPJGenerator,
    tags: ['cnpj', 'brazil', 'company', 'business'],
  }),
  createTool({
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUIDs (v4)',
    icon: '🔑',
    category: 'generator',
    component: UUIDGenerator,
    tags: ['uuid', 'guid', 'unique', 'identifier'],
  }),
  createTool({
    id: 'cpf-validator',
    name: 'CPF Validator',
    description: 'Validate Brazilian CPF numbers',
    icon: '✅',
    category: 'utility',
    component: CPFValidator,
    tags: ['cpf', 'brazil', 'validate', 'check', 'verification'],
  }),
  createTool({
    id: 'cnpj-validator',
    name: 'CNPJ Validator',
    description: 'Validate Brazilian CNPJ numbers',
    icon: '✔️',
    category: 'utility',
    component: CNPJValidator,
    tags: ['cnpj', 'brazil', 'validate', 'check', 'verification'],
  }),
  createTool({
    id: 'webhook-listener',
    name: 'Webhook Listener',
    description: 'Listen and inspect incoming webhooks',
    icon: '🪝',
    category: 'utility',
    component: WebhookListener,
    tags: ['webhook', 'http', 'server', 'listener'],
  }),
])

function App() {
  return <AppLayout />
}

export default App
