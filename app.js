import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://oxqpwocwlfqfadsyoquh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cXB3b2N3bGZxZmFkc3lvcXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjA3MTUsImV4cCI6MjA2OTUzNjcxNX0.BLiPR-uZd4YG6-GSfMnb3AfweMypeOABS3reGu6jvG0'
const supabase = createClient(supabaseUrl, supabaseKey)

//window.addEventListener('DOMContentLoaded', () => {
//  const loading = document.getElementById('loadingScreen')
//  const signin = document.getElementById('signinScreen')
//  setTimeout(() => {
//    loading.style.display = 'none'
//    signin.classList.remove('hidden')
//  }, 2000)
//})

window.signIn = async () => {
  const dobEl = document.getElementById('dob')
  const rollEl = document.getElementById('roll')
  const errorBox = document.getElementById('error')
  const signInBtn = document.getElementById('signinBtn')

  const dob = dobEl ? dobEl.value.trim() : ''
  const roll = rollEl ? rollEl.value.trim() : ''

  // clear previous error
  if (errorBox) errorBox.textContent = ''

  if (!dob || !roll) {
    if (errorBox) errorBox.textContent = 'Please fill in all fields.'
    return
  }

  // Basic DOB validation (YYYY-MM-DD)
  const dobRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dobRegex.test(dob) || isNaN(new Date(dob).getTime())) {
    if (errorBox) errorBox.textContent = 'Please enter Date of Birth in YYYY-MM-DD format.'
    return
  }

  // Basic roll validation: allow alphanumeric and common punctuation, minimum 2 chars
  const rollRegex = /^[A-Za-z0-9\-_.]{2,}$/
  if (!rollRegex.test(roll)) {
    if (errorBox) errorBox.textContent = 'Please enter a valid Roll Number.'
    return
  }

  if (signInBtn) signInBtn.disabled = true

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('dob', dob)     // exact match
      .eq('roll_number', roll)
      .single()
    const UserId = data.id;
    if (error || !data) {
      console.error('Sign-in error:', error)
      if (errorBox) errorBox.textContent = 'Date of Birth or Roll Number is incorrect or not registered.'
    } else {
      localStorage.setItem('user', JSON.stringify(data))
      window.location.href = "dashboard.html?userId=" + UserId;
    }
  } catch (err) {
    console.error('Unexpected sign-in error:', err)
    if (errorBox) errorBox.textContent = 'An unexpected error occurred. Please try again.'
  } finally {
    if (signInBtn) signInBtn.disabled = false
  }
}


window.signUp = async () => {
  const name = document.getElementById('signupName').value.trim()
  const roll = document.getElementById('signupRoll').value.trim()
  const dob = document.getElementById('signupDOB').value.trim()
  const mobile = document.getElementById('signupMobile').value.trim()
  const email = document.getElementById('signupEmail').value.trim()
  const errorBox = document.getElementById('signupError')

  if (!name || !roll || !dob) {
    errorBox.textContent = 'Please fill all required fields.'
    return
  }

  // Prepare user data object with required fields
  const userData = {
    name,
    roll_number: roll,
    dob,
    email
  }

  // Only include mobile if it's filled
  if (mobile) {
    userData.mobile = mobile
  }

  const { data, error } = await supabase
    .from('users')
    .insert([userData])

  if (error) {
    errorBox.textContent = 'Sign up failed: ' + error.message
  } else {
    alert('Sign up successful! Please sign in.')
    window.location.href = 'signin.html'
  }
}

