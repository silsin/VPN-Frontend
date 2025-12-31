<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>ورود به پنل مدیریت VPN</h1>
        <p>لطفاً اطلاعات خود را وارد کنید</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">ایمیل</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="ایمیل خود را وارد کنید"
            required
            :disabled="loading"
          />
        </div>
        
        <div class="form-group">
          <label for="password">رمز عبور</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="رمز عبور خود را وارد کنید"
            required
            :disabled="loading"
          />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="loading">در حال ورود...</span>
          <span v-else>ورود</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const result = await authStore.login(email.value, password.value)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error || 'ایمیل یا رمز عبور اشتباه است'
    }
  } catch (err) {
    error.value = 'خطا در ورود. لطفاً دوباره تلاش کنید.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  /* align-items: center; Removed to prevent clipping on small height/keyboard open */
  /* justify-content: center; Removed to prevent clipping */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow-y: auto; /* Allow scrolling */
}

.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: pulse 15s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.login-card {
  margin: auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  font-family: 'Vazirmatn', sans-serif;
}

.login-header p {
  color: #718096;
  font-size: 15px;
  font-weight: 400;
  font-family: 'Vazirmatn', sans-serif;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  color: #4a5568;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Vazirmatn', sans-serif;
}

.form-group input {
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: 'Vazirmatn', sans-serif;
  background: #ffffff;
  color: #2d3748;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
  color: #a0aec0;
}

.error-message {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 82, 82, 0.1) 100%);
  color: #e53e3e;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 14px;
  text-align: center;
  border: 2px solid rgba(255, 107, 107, 0.3);
  font-family: 'Vazirmatn', sans-serif;
  font-weight: 500;
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  font-family: 'Vazirmatn', sans-serif;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  box-shadow: none;
}

/* Tablet */
@media (max-width: 768px) {
  .login-card {
    padding: 40px 32px;
  }
}

/* Mobile Medium */
@media (max-width: 480px) {
  .login-container::before {
    display: none; /* Save performance and prevent glitches */
  }

  .login-container {
    padding: 16px;
  }

  .login-card {
    padding: 24px 16px;
  }

  .login-header {
    margin-bottom: 24px;
  }

  .login-header h1 {
    font-size: 20px;
  }

  .login-header p {
    font-size: 13px;
  }

  .login-form {
    gap: 20px;
  }

  .form-group input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}

/* Mobile Small */
@media (max-width: 360px) {
  .login-container {
    padding: 12px;
  }

  .login-card {
    padding: 24px 16px;
  }

  .login-header h1 {
    font-size: 18px;
  }

  .login-button {
    width: 100%;
    padding: 12px 20px;
  }
}
</style>

