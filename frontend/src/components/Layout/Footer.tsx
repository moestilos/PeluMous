import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Divider
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email
} from '@mui/icons-material';

const Footer: React.FC = () => {

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#ffffff',
        border: '3px solid #000000',
        borderTop: '3px solid #000000',
        borderRadius: '16px 16px 0 0',
        boxShadow: '0 -8px 0px #000000',
        color: '#000000',
        mt: 'auto',
        py: 3
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          {/* Main Footer Content */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: 'center', md: 'flex-start' }}
          >
            {/* Company Info */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#000000' }}>
                Moestilos
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666', mb: 2, maxWidth: 250 }}>
                Tu centro de belleza profesional. Servicios de alta calidad.
              </Typography>
            </Box>

            {/* Contact Info */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#000000' }}>
                Contacto
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <LocationOn sx={{ fontSize: 16, color: '#000000' }} />
                  <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem' }}>
                    Calle Moestilos 123, Ciudad
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <Phone sx={{ fontSize: 16, color: '#000000' }} />
                  <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem' }}>
                    +34 123 456 789
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <Email sx={{ fontSize: 16, color: '#000000' }} />
                  <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem' }}>
                    info@moestilos.com
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            {/* Business Hours */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: '#000000' }}>
                Horarios
              </Typography>
              <Stack spacing={0.5} alignItems={{ xs: 'center', md: 'flex-start' }}>
                <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem' }}>
                  Lun - Vie: 9:00 - 20:00
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem' }}>
                  Sáb: 9:00 - 18:00
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem' }}>
                  Dom: Cerrado
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ borderColor: '#e0e0e0', borderWidth: 1 }} />

          {/* Bottom Footer */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" sx={{ color: '#666666', fontSize: '0.875rem' }}>
              © 2025 Moestilos. Todos los derechos reservados.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Typography
                variant="body2"
                sx={{
                  color: '#666666',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#000000'
                  }
                }}
              >
                Política de Privacidad
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#666666',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#000000'
                  }
                }}
              >
                Términos de Uso
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
