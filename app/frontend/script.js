const form = document.getElementById('login-form')
const resultMessage = document.getElementById('result-message')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const username = document.getElementById('username').value
  const password = document.getElementById('password').value

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json()

    if (data.token) {
      localStorage.setItem('auth_token', data.token)
      resultMessage.textContent = `Welcome, ${username}! You are now logged in.`
      resultMessage.className = 'success'
    } else {
      resultMessage.textContent = `Login failed: ${data.error || 'Invalid credentials'}`
      resultMessage.className = 'error'
    }

    resultMessage.style.opacity = 0
    resultMessage.style.transform = 'translateY(-10px)'
    setTimeout(() => {
      resultMessage.style.opacity = 1
      resultMessage.style.transform = 'translateY(0)'
    }, 50)

  } catch (err) {
    resultMessage.textContent = 'Server error. Please try again later.'
    resultMessage.className = 'error'
  }
})
