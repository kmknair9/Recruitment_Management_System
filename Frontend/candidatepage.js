const Token = localStorage.getItem('token');
const Role = localStorage.getItem('role');
const UserId = localStorage.getItem('userid');
const FormContent = document.getElementById('formcontent');
const DisplayList = document.getElementById('displaycandidateslist');
const SubmitButton = document.getElementById('submitbutton');
const UpdateButton = document.getElementById('updatebutton');
const CandidateName = document.getElementById('name');
const CandidateEmail = document.getElementById('email');
const CandidatePhone = document.getElementById('phoneNumber');
const CandidateStatus = document.getElementById('currentStatus');
const CandidateResLink = document.getElementById('resumeLink');
const CrudStatus = document.getElementById('crudstatus');
const CandidateListButton = document.getElementById('candidatelistbutton');
const CandidateFormButton = document.getElementById('candidateformbutton');


window.addEventListener('DOMContentLoaded', () => {
  if (!Token || !UserId) {
    window.location.href = 'loginpage.html'
  }
});

if (Role === 'Candidate') {
  CandidateListButton.hidden = true;
  document.querySelector('.currentstatuscontainer').hidden = true;
}

function formContent(){
  CrudStatus.hidden = true;
  FormContent.hidden = false;
  DisplayList.hidden = true;
  SubmitButton.hidden = false;
  UpdateButton.hidden = true;
  CandidateName.value = '';
  CandidateEmail.value = '';
  CandidatePhone.value = '';
  CandidateStatus.value = '';
  CandidateResLink.value = '';
  if (Role !== 'Candidate' && Role !== 'Hiring_Manager'){
    CandidateFormButton.hidden = true;
    CandidateListButton.hidden = false;
  }
}

FormContent.addEventListener('submit', async (e) => {
  e.preventDefault();

  let candidate = {};

  if (Role === 'Candidate') {  
    candidate = {
      userId: UserId,
      type: 'candidate',
      name: e.target.name.value,
      email: e.target.email.value,
      phoneNumber: e.target.phoneNumber.value,
      currentStatus: ' ',
      resumeLink: e.target.resumeLink.value
    };

  } else {
      candidate = {
        userId: UserId,
        type: 'others',
        name: e.target.name.value,
        email: e.target.email.value,
        phoneNumber: e.target.phoneNumber.value,
        currentStatus: e.target.currentStatus.value,
        resumeLink: e.target.resumeLink.value  
    };
  }
    try {
      const response = await fetch('http://localhost:5000/candidates', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidate)
      });
      CrudStatus.hidden = false;
      const data = await response.json();
      if (response.ok) {
        CrudStatus.innerHTML = 'Candidate Details Submitted Successfully!!!';
        FormContent.hidden = true;
      } else if (data.message === 'Already filled') {
          CrudStatus.innerHTML = 'Already Filled Candidate Details'; 
      } else {
          CrudStatus.innerHTML = 'Error Submitting Candidates Data!!';
      }
    } catch (err) {
        console.error('Error submitting Candidate:', err);
    }
});

async function getAllCandidates () {
  if (Role !== 'Candidate' && Role !== 'Hiring_Manager'){
    CandidateListButton.hidden = true;
    CandidateFormButton.hidden = false;
  }
  CrudStatus.hidden = true;
  try {
    const response = await fetch('http://localhost:5000/candidates', {
      method: 'GET'
  });
  CrudStatus.hidden = false;
  const result = await response.json();
    if (response.ok) {
      CrudStatus.innerHTML = 'All Candidates Data Fetched Successfully!!!';
      FormContent.hidden = true;
      DisplayList.innerHTML='';
      DisplayList.hidden = false;
      result.data.forEach((candidate, index) => {
        DisplayList.innerHTML += `
        <div>
          <br/>
          <button onclick="editCandidate('${candidate._id}')">Edit</button>
          <button class="deletebutton2" onclick="deleteCandidate('${candidate._id}')">Delete</button>
        </div>
        <div>
          <ol> 
            <li>Candidate : ${index+1}</li>
            <li>Name: ${candidate.name}</li>
            <li>Email: ${candidate.email}</li>
            <li>Phone Number: ${candidate.phoneNumber}</li>
            <li>Current Status: ${candidate.currentStatus}</li>
            <li>Resume Link: ${candidate.resumeLink}</li>
          <ol>
        <div>`;
      });
      if (Role === 'Recruiter') {
        document.querySelectorAll('.deletebutton2').forEach(button => {
          button.hidden = true;
      });
      }
    } else {
        CrudStatus.innerHTML = 'Error fetching Candidate Details!!!!';
        console.log('Error fetching data', result);
    }
  } catch (err) {
      console.error('Error getting all candidates details', err);
  }
};

async function deleteCandidate (id) {
  const confirmation = confirm("Are you sure you want to delete this Candidate???");
    if(!confirmation) return;

    try {
      const response = await fetch(`http://localhost:5000/candidates/${id}`, {
        method: 'DELETE'
    });
    CrudStatus.hidden = false;
    await response.json();
      if (response.ok) {  
        CrudStatus.innerHTML = `Candidate Details Deleted Successfully`;
        DisplayList.hidden = true; 
        DisplayList.innerHTML = '';
        CandidateFormButton.hidden = true;
        CandidateListButton.hidden = false;
      } else {
          CrudStatus.innerHTML = `Error Deleting Candidate Details!!!`
      }
    } catch (err) {
        console.error('Error Deleting data', err);
    } 
};

async function editCandidate (id) {
  SubmitButton.setAttribute("hidden",'hidden');
  DisplayList.hidden = true;
  FormContent.hidden = false;
  CrudStatus.hidden = true;

  const response = await fetch(`http://localhost:5000/candidates/${id}`,{
    method:'GET'
  });

  const candidate = await response.json();
  CandidateName.value = candidate.data.name;
  CandidateEmail.value = candidate.data.email;
  CandidatePhone.value = candidate.data.phoneNumber;
  CandidateStatus.value = candidate.data.currentStatus;
  CandidateResLink.value = candidate.data.resumeLink;
  UpdateButton.hidden = false;

  UpdateButton.onclick = async (e) => {
    
    e.preventDefault();

    const updatedCandidate = {
      name: CandidateName.value,
      email: CandidateEmail.value,
      phoneNumber: CandidatePhone.value,
      currentStatus: CandidateStatus.value,
      resumeLink: CandidateResLink.value
    };

    try {
      const response = await fetch(`http://localhost:5000/candidates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(updatedCandidate),
      });
      CrudStatus.hidden = false;
      await response.json();
      if (response.ok) {
        CrudStatus.innerHTML = 'Updated Candidate Details!!!!';
        FormContent.hidden = true;
        CandidateFormButton.hidden = true;
        CandidateListButton.hidden = false;
      } else {
          CrudStatus.innerHTML = 'Error Updated Candidate!!!';
      }
    } catch (err) {
        console.error('Error Updating Data',err);
    }
    };
}

function LogOut() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userid');
  window.location.href = 'loginpage.html';
}