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
  background: #0f172a;
  background-image: 
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.2) 0, transparent 50%), 
    radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.2) 0, transparent 50%), 
    radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.1) 0, transparent 50%), 
    radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.1) 0, transparent 50%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-card {
  margin: auto;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(25px) saturate(180%);
  border-radius: 28px;
  padding: 48px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;
  font-family: 'Vazirmatn', sans-serif;
  letter-spacing: -1px;
}

.login-header p {
  color: #94a3b8;
  font-size: 15px;
  font-weight: 400;
  font-family: 'Vazirmatn', sans-serif;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #cbd5e1;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Vazirmatn', sans-serif;
  margin-right: 4px;
}

.form-group input {
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: 'Vazirmatn', sans-serif;
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
}

.form-group input:focus {
  outline: none;
  border-color: #818cf8;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.1);
}

.error-message {
  background: rgba(225, 29, 72, 0.1);
  color: #fb7185;
  padding: 14px;
  border-radius: 14px;
  font-size: 14px;
  text-align: center;
  border: 1px solid rgba(225, 29, 72, 0.2);
  font-family: 'Vazirmatn', sans-serif;
}

.login-button {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: #ffffff;
  border: none;
  padding: 18px 32px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  margin-top: 8px;
  font-family: 'Vazirmatn', sans-serif;
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 20px 35px -10px rgba(99, 102, 241, 0.5);
  filter: brightness(1.1);
}

.login-button:disabled {
  background: #334155;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.5;
}

@media (max-width: 480px) {
  .login-card { padding: 32px 24px; border-radius: 20px; }
  .login-header h1 { font-size: 24px; }
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

