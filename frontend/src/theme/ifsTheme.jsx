// ifsTheme.jsx
import { createTheme, rem } from '@mantine/core';

export const ifsTheme = createTheme({
  primaryColor: 'wojcik-blue',
  defaultRadius: rem(6), // Zaokrąglone krawędzie jak w YouTrack
  fontFamily: 'Inter, system-ui, sans-serif',
  colorScheme: 'light', // Domyślnie light, z niebieskawym tłem
  
  colors: {
    'wojcik-red': [
      '#fff0f1', '#ffdde0', '#ffb7bd', '#ff8f99', '#ff6d7a', 
      '#ff4d5f', '#ff334b', '#e61d36', '#cc142c', '#C41230' 
    ],
    'wojcik-blue': [
      '#f0f8ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa',
      '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'
    ],
    'slate': [
      '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8',
      '#64748b', '#475569', '#334155', '#1e293b', '#0f172a'
    ],
    'yt-green': [
      '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80',
      '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'
    ]
  },

  components: {
    Button: {
      defaultProps: { fw: 600, size: 'xs' },
      styles: { root: { transition: 'background-color 0.15s ease' } }
    },
    Paper: {
      defaultProps: { withBorder: false, shadow: 'xs', radius: 'md' },
    },
    Modal: {
      styles: {
        header: { borderBottom: '1px solid var(--mantine-color-slate-2)' },
        content: { boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: 'md' }
      }
    },
    Badge: {
      styles: {
        root: { textTransform: 'none', borderRadius: 'md' }
      }
    },
    Table: {
      defaultProps: { withBorder: false, highlightOnHover: true },
      styles: {
        table: { borderCollapse: 'separate', borderSpacing: '0 8px', background: 'transparent' },
        tr: { 
          backgroundColor: 'var(--mantine-color-body)', 
          borderRadius: 'md', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.2s ease',
          '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }
        },
        th: { 
          textAlign: 'left', 
          padding: `${rem(8)} ${rem(12)}`, 
          fontSize: rem(12), 
          fontWeight: 600, 
          color: 'var(--mantine-color-slate-7)',
          borderBottom: 'none'
        },
        td: { 
          padding: `${rem(8)} ${rem(12)}`, 
          borderTop: 'none',
          '&:first-of-type': { borderTopLeftRadius: 'md', borderBottomLeftRadius: 'md' },
          '&:last-of-type': { borderTopRightRadius: 'md', borderBottomRightRadius: 'md' }
        }
      }
    },
    Collapse: {
      styles: {
        content: { transition: 'max-height 0.3s ease-out', overflow: 'hidden' }
      }
    }
  }
});