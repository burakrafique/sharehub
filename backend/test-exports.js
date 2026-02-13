// Test what's being exported from authController
const authController = require('./controllers/authController');

console.log('Auth Controller exports:');
console.log(Object.keys(authController));

authController.register && console.log('✅ register exists');
authController.login && console.log('✅ login exists');
authController.getCurrentUser && console.log('✅ getCurrentUser exists');
authController.updateProfile && console.log('✅ updateProfile exists');
authController.changePassword && console.log('✅ changePassword exists');
authController.logout && console.log('✅ logout exists');

!authController.register && console.log('❌ register missing');
!authController.login && console.log('❌ login missing');
!authController.getCurrentUser && console.log('❌ getCurrentUser missing');
!authController.updateProfile && console.log('❌ updateProfile missing');
!authController.changePassword && console.log('❌ changePassword missing');
!authController.logout && console.log('❌ logout missing');