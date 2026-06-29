import type { Database } from '@/types/supabase'

type ItemCategory = Database['public']['Enums']['item_category']
type ItemStatus = Database['public']['Enums']['item_status']

export const categoryLabels: Record<ItemCategory, string> = {
  water: 'Agua',
  food: 'Alimentos',
  personal_hygiene: 'Higiene personal',
  household_cleaning: 'Limpieza del hogar',
  baby: 'Bebé',
  medical: 'Medicamentos',
  clothing: 'Ropa',
  bedding: 'Abrigo y descanso',
  shelter: 'Refugio y emergencia',
  other: 'Otros',
}

export const categoryOrder: ItemCategory[] = [
  'water',
  'food',
  'medical',
  'baby',
  'personal_hygiene',
  'household_cleaning',
  'bedding',
  'shelter',
  'clothing',
  'other',
]

export const statusLabels: Record<ItemStatus, string> = {
  needed: 'Necesita',
  sufficient: 'Suficiente',
  surplus: 'Le sobra',
}

// For badges / status pills
export const statusColors: Record<ItemStatus, string> = {
  needed: 'bg-red-100 text-red-800 border-red-200',
  sufficient: 'bg-gray-100 text-gray-700 border-gray-200',
  surplus: 'bg-green-100 text-green-800 border-green-200',
}