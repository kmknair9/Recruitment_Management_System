const SignUpContent = document.getElementById('signupcontent');
const LoginButton = document.getElementById('loginbutton'); 
const SigninButton = document.getElementById('signinbutton');
const SignupButton = document.getElementById('signupbutton');
const Email = document.getElementById('email');
const Password = document.getElementById('password');
const RoleContent = document.getElementById('rolecontainer');

SignupButton.hidden = false;

document.getElementById('formcontent2').addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = {
    email: e.target.email.value,
    password: e.target.password.value
  }

  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

  const result = await response.json();
    if (response.ok) {
      localStorage.setItem('token',result.token);
      localStorage.setItem('role',result.role);
      localStorage.setItem('userid', result.userId);
      Email.value='';
      Password.value='';
        if (result.role === 'Hiring_Manager') {
          window.location.href = 'job.html';
        }
        else if (result.token && result.role ) {
          window.location.href = 'candidatepage.html';
        } 
    } else {
        SignUpContent.hidden = false;
        SignupButton.hidden = false;
    }
  } catch (err) {
      console.log('Error logging user', err);
  }
});

SignupButton.onclick = async (e) => {
  e.preventDefault();
  SigninButton.hidden = false;
  RoleContent.hidden = false;
  LoginButton.hidden = true;
  SignUpContent.hidden = true;
  SignupButton.hidden = true;
};

async function SignUp () {
  const newUser = {
    email: Email.value,
    password: Password.value,
    role: document.getElementById('role').value
  };
  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
  });

  const result = await response.json();
    if (response.ok) {
      SignUpContent.innerHTML='User Registered Successfully';   
      SignUpContent.removeAttribute('hidden','hidden');
    } else {
        console.log('Error registering User', result);
    }
    } catch (err) {
        console.log('Registration Error', err);
    }

  RoleContent.hidden = true;
  SignupButton.hidden = true;
  SigninButton.hidden = true;
  document.getElementById('emailcontainer').hidden = false;
  document.getElementById('passwordcontainer').hidden = false;
  LoginButton.hidden = false;
  Email.value = '';
  Password.value = '';
}