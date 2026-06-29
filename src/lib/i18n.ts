import type { Database } from '@/types/supabase'

type ItemCategory = Database['public']['Enums']['item_category']
type ItemStatus = Database['public']['Enums']['item_status']

export const locales = ['es', 'it', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'es'
export const localeCookieName = 'centros_locale'

export const languageOptions: Array<{
  code: Locale
  label: string
  shortLabel: string
}> = [
  { code: 'es', label: 'Español', shortLabel: 'ES' },
  { code: 'it', label: 'Italiano', shortLabel: 'IT' },
  { code: 'en', label: 'English', shortLabel: 'EN' },
]

type Dictionary = {
  metadata: {
    centerNotFound: string
    centerFallbackDescription: string
  }
  nav: {
    brand: string
    languageLabel: string
  }
  home: {
    title: string
    description: string
    emptyCenters: string
    mapTitle: string
    activeCenterSingular: string
    activeCenterPlural: string
    centersTitle: string
    confirmBeforeGoing: string
    note: string
  }
  centerCard: {
    verified: string
    confirm: string
  }
  map: {
    verified: string
    pendingVerification: string
    needs: string
    details: string
  }
  centerDetail: {
    back: string
    verified: string
    staleWarning: string
    address: string
    openingHours: string
    phone: string
    email: string
    currentNeeds: string
    updated: string
  }
  follow: {
    trigger: string
    titlePrefix: string
    description: string
    emailLabel: string
    emailPlaceholder: string
    success: string
    close: string
    cancel: string
    save: string
    errors: {
      emptyEmail: string
      invalid_contact: string
      invalid_json: string
      center_not_found: string
      subscriptions_not_configured: string
      database_insert_failed: string
      generic: string
      network: string
    }
  }
  items: {
    empty: string
    statuses: Record<ItemStatus, { title: string; description: string }>
    categories: Record<ItemCategory, string>
  }
}

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    metadata: {
      centerNotFound: 'Centro no encontrado',
      centerFallbackDescription:
        'Centro de acopio en {city}. Consulta qué necesita ahora.',
    },
    nav: {
      brand: 'Centros de acopio para Venezuela',
      languageLabel: 'Idioma',
    },
    home: {
      title: 'Centros de acopio para Venezuela',
      description:
        'Encuentra puntos de recogida activos, revisa qué necesita cada centro y lleva tu donación donde más puede ayudar.',
      emptyCenters:
        'Todavía no hay centros activos registrados. Estamos coordinando con las primeras organizaciones.',
      mapTitle: 'Mapa',
      activeCenterSingular: 'centro activo',
      activeCenterPlural: 'centros activos',
      centersTitle: 'Centros',
      confirmBeforeGoing: 'Confirma antes de ir',
      note:
        'Antes de desplazarte, confirma horario y necesidades por teléfono. Las necesidades pueden cambiar durante el día.',
    },
    centerCard: {
      verified: 'Verificado',
      confirm: 'Confirmar',
    },
    map: {
      verified: 'Verificado',
      pendingVerification: 'Pendiente verificación',
      needs: 'Necesita',
      details: 'Ver detalles',
    },
    centerDetail: {
      back: 'Volver',
      verified: 'Verificado',
      staleWarning:
        'La información de este centro no se actualiza desde hace más de 48 horas. Antes de desplazarte, confirma por teléfono que sigue activo y que las necesidades son correctas.',
      address: 'Dirección',
      openingHours: 'Horario',
      phone: 'Teléfono',
      email: 'Email',
      currentNeeds: 'Necesidades actuales',
      updated: 'Actualizado',
    },
    follow: {
      trigger: 'Recibir avisos',
      titlePrefix: 'Seguir',
      description:
        'Déjanos tu email para avisarte cuando haya novedades de este centro.',
      emailLabel: 'Email',
      emailPlaceholder: 'tu@email.com',
      success:
        'Listo. Guardamos tu email para los próximos avisos de este centro.',
      close: 'Cerrar',
      cancel: 'Cancelar',
      save: 'Guardar',
      errors: {
        emptyEmail: 'Escribe tu email.',
        invalid_contact: 'Escribe un email válido.',
        invalid_json: 'No pudimos leer los datos del formulario.',
        center_not_found: 'No encontramos este centro.',
        subscriptions_not_configured:
          'El seguimiento todavía no está activado. Falta aplicar la migración de subscriptions.',
        database_insert_failed: 'No pudimos guardar el seguimiento ahora.',
        generic: 'No pudimos guardar el seguimiento ahora.',
        network: 'No pudimos conectar con el servidor. Inténtalo otra vez.',
      },
    },
    items: {
      empty: 'Este centro todavía no ha publicado sus necesidades.',
      statuses: {
        needed: {
          title: 'Necesita',
          description:
            'Estos artículos hacen falta ahora. Si puedes traerlos, este es el centro.',
        },
        surplus: {
          title: 'Le sobra',
          description:
            'Este centro tiene de más estos artículos. Mejor llevarlos a otro.',
        },
        sufficient: {
          title: 'Suficiente',
          description: 'Cubierto por ahora, no urge.',
        },
      },
      categories: {
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
      },
    },
  },
  it: {
    metadata: {
      centerNotFound: 'Centro non trovato',
      centerFallbackDescription:
        'Centro di raccolta a {city}. Controlla di cosa ha bisogno ora.',
    },
    nav: {
      brand: 'Centri di raccolta per il Venezuela',
      languageLabel: 'Lingua',
    },
    home: {
      title: 'Centri di raccolta per il Venezuela',
      description:
        'Trova punti di raccolta attivi, controlla di cosa ha bisogno ogni centro e porta la tua donazione dove può aiutare di più.',
      emptyCenters:
        'Non ci sono ancora centri attivi registrati. Stiamo coordinando le prime organizzazioni.',
      mapTitle: 'Mappa',
      activeCenterSingular: 'centro attivo',
      activeCenterPlural: 'centri attivi',
      centersTitle: 'Centri',
      confirmBeforeGoing: 'Conferma prima di andare',
      note:
        'Prima di spostarti, conferma orari e necessità per telefono. Le necessità possono cambiare durante la giornata.',
    },
    centerCard: {
      verified: 'Verificato',
      confirm: 'Conferma',
    },
    map: {
      verified: 'Verificato',
      pendingVerification: 'In attesa di verifica',
      needs: 'Serve',
      details: 'Vedi dettagli',
    },
    centerDetail: {
      back: 'Indietro',
      verified: 'Verificato',
      staleWarning:
        'Le informazioni di questo centro non vengono aggiornate da più di 48 ore. Prima di spostarti, conferma per telefono che sia ancora attivo e che le necessità siano corrette.',
      address: 'Indirizzo',
      openingHours: 'Orari',
      phone: 'Telefono',
      email: 'Email',
      currentNeeds: 'Necessità attuali',
      updated: 'Aggiornato',
    },
    follow: {
      trigger: 'Ricevi avvisi',
      titlePrefix: 'Segui',
      description:
        'Lasciaci la tua email per avvisarti quando ci sono novità su questo centro.',
      emailLabel: 'Email',
      emailPlaceholder: 'tu@email.com',
      success:
        'Fatto. Abbiamo salvato la tua email per i prossimi avvisi di questo centro.',
      close: 'Chiudi',
      cancel: 'Annulla',
      save: 'Salva',
      errors: {
        emptyEmail: 'Scrivi la tua email.',
        invalid_contact: 'Scrivi una email valida.',
        invalid_json: 'Non siamo riusciti a leggere i dati del modulo.',
        center_not_found: 'Non abbiamo trovato questo centro.',
        subscriptions_not_configured:
          'Il seguito non è ancora attivo. Manca la migrazione di subscriptions.',
        database_insert_failed: 'Non siamo riusciti a salvare il seguito ora.',
        generic: 'Non siamo riusciti a salvare il seguito ora.',
        network:
          'Non siamo riusciti a connetterci al server. Riprova tra poco.',
      },
    },
    items: {
      empty: 'Questo centro non ha ancora pubblicato le sue necessità.',
      statuses: {
        needed: {
          title: 'Serve',
          description:
            'Questi articoli servono ora. Se puoi portarli, questo è il centro giusto.',
        },
        surplus: {
          title: 'In eccesso',
          description:
            'Questo centro ne ha già abbastanza. Meglio portarli a un altro centro.',
        },
        sufficient: {
          title: 'Sufficiente',
          description: 'Coperto per ora, non è urgente.',
        },
      },
      categories: {
        water: 'Acqua',
        food: 'Alimenti',
        personal_hygiene: 'Igiene personale',
        household_cleaning: 'Pulizia della casa',
        baby: 'Bambini',
        medical: 'Medicinali',
        clothing: 'Abbigliamento',
        bedding: 'Coperte e riposo',
        shelter: 'Rifugio ed emergenza',
        other: 'Altro',
      },
    },
  },
  en: {
    metadata: {
      centerNotFound: 'Center not found',
      centerFallbackDescription:
        'Collection center in {city}. Check what it needs now.',
    },
    nav: {
      brand: 'Collection centers for Venezuela',
      languageLabel: 'Language',
    },
    home: {
      title: 'Collection centers for Venezuela',
      description:
        'Find active drop-off points, check what each center needs, and bring your donation where it can help most.',
      emptyCenters:
        'There are no active centers registered yet. We are coordinating with the first organizations.',
      mapTitle: 'Map',
      activeCenterSingular: 'active center',
      activeCenterPlural: 'active centers',
      centersTitle: 'Centers',
      confirmBeforeGoing: 'Confirm before going',
      note:
        'Before you go, confirm opening hours and current needs by phone. Needs can change during the day.',
    },
    centerCard: {
      verified: 'Verified',
      confirm: 'Confirm',
    },
    map: {
      verified: 'Verified',
      pendingVerification: 'Pending verification',
      needs: 'Needs',
      details: 'View details',
    },
    centerDetail: {
      back: 'Back',
      verified: 'Verified',
      staleWarning:
        'This center has not been updated for more than 48 hours. Before going, call to confirm it is still active and that the needs are still correct.',
      address: 'Address',
      openingHours: 'Hours',
      phone: 'Phone',
      email: 'Email',
      currentNeeds: 'Current needs',
      updated: 'Updated',
    },
    follow: {
      trigger: 'Get updates',
      titlePrefix: 'Follow',
      description:
        'Leave your email and we will let you know when this center has updates.',
      emailLabel: 'Email',
      emailPlaceholder: 'you@email.com',
      success:
        'Done. We saved your email for future updates from this center.',
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      errors: {
        emptyEmail: 'Enter your email.',
        invalid_contact: 'Enter a valid email.',
        invalid_json: 'We could not read the form data.',
        center_not_found: 'We could not find this center.',
        subscriptions_not_configured:
          'Following is not active yet. The subscriptions migration is missing.',
        database_insert_failed: 'We could not save the follow request now.',
        generic: 'We could not save the follow request now.',
        network: 'We could not connect to the server. Please try again.',
      },
    },
    items: {
      empty: 'This center has not published its needs yet.',
      statuses: {
        needed: {
          title: 'Needed',
          description:
            'These items are needed now. If you can bring them, this is the right center.',
        },
        surplus: {
          title: 'Extra stock',
          description:
            'This center has enough of these items. It is better to bring them elsewhere.',
        },
        sufficient: {
          title: 'Enough for now',
          description: 'Covered for now, not urgent.',
        },
      },
      categories: {
        water: 'Water',
        food: 'Food',
        personal_hygiene: 'Personal hygiene',
        household_cleaning: 'Household cleaning',
        baby: 'Baby',
        medical: 'Medical supplies',
        clothing: 'Clothing',
        bedding: 'Bedding and warmth',
        shelter: 'Shelter and emergency',
        other: 'Other',
      },
    },
  },
}

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value && locales.includes(value as Locale))
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale]
}
