module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'fce0986d95a64a78a9ab91917984cf5e'),
  },
});
