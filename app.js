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
  const name = document.getElementById('name').value.trim().toLowerCase()
  const roll = document.getElementById('roll').value.trim()
  const errorBox = document.getElementById('error')

  if (!name || !roll) {
    errorBox.textContent = 'Please fill in all fields.'
    return
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('name', name)     // case-insensitive match
    .eq('roll_number', roll) // exact match
    .single()

  if (error || !data) {
    errorBox.textContent = 'Name or Roll Number is incorrect or not registered.'
  } else {
    localStorage.setItem('user', JSON.stringify(data))
    window.location.href = 'dashboard.html'
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

