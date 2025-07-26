export function getFirebaseAuthErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-email':
    case 'auth/user-disabled':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Correo o contraseña incorrectos.';
    default:
      return 'Ocurrió un error inesperado. Intenta de nuevo.';
  }
}