let FormContent = document.getElementById('formcontent');
let DisplayList = document.getElementById('displaycandidateslist');
let SubmitButton = document.getElementById('submitbutton');
let UpdateButton = document.getElementById('updatebutton');
let CandidateId = document.getElementById('candidateId');
let CandidateName = document.getElementById('name');
let CandidateEmail = document.getElementById('email');
let CandidatePhone = document.getElementById('phoneNumber');
let CandidateStatus = document.getElementById('currentStatus');
let CandidateResLink = document.getElementById('resumeLink');


function formContent(){
  FormContent.removeAttribute('hidden');
  DisplayList.setAttribute('hidden','hidden');
  SubmitButton.removeAttribute('hidden');
  UpdateButton.setAttribute('hidden','hidden');
  CandidateId.value = '';
  CandidateName.value = '';
  CandidateEmail.value = '';
  CandidatePhone.value = '';
  CandidateStatus.value = '';
  CandidateResLink.value = '';
}

FormContent.addEventListener('submit', async (e) => {
  e.preventDefault();

  const candidate = {
    candidateId: e.target.candidateId.value,
    name: e.target.name.value,
    email: e.target.email.value,
    phoneNumber: e.target.phoneNumber.value,
    currentStatus: e.target.currentStatus.value,
    resumeLink: e.target.resumeLink.value    
  };

  try {
    const response = await fetch('http://localhost:5000/candidates', {
    method: 'POST',
    headers:{
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(candidate)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Candidate Details Submitted Successfully',data);
      FormContent.setAttribute('hidden','hidden');
    } else {
      console.log('Error submitting Candidate Details:', response.statusText);
    }
  } catch (err) {
    console.error('Error submitting Candidate:', err);
  }
});

async function getAllCandidates () {
  try {
    const response = await fetch('http://localhost:5000/candidates', {
    method: 'GET'
  });

    if (response.ok) {
      const result = await response.json();
      console.log('All Candidates Data Fetched Successfully', result);
      FormContent.setAttribute('hidden','hidden');
      DisplayList.innerHTML='';
      DisplayList.removeAttribute('hidden');
        result.data.forEach((candidate,index) => {
          DisplayList.innerHTML += `
            <div>
            <br/>
            <button onclick="editCandidate('${candidate._id}')">Edit</button>
            <button onclick="deleteCandidate('${candidate._id}')">Delete</button>
            </div>
            <div>
            <ol> 
            <li>Candidate : ${index+1}</li>
            <li>Candidate ID: ${candidate.candidateId}</li>
            <li>Name: ${candidate.name}</li>
            <li>Email: ${candidate.email}</li>
            <li>Phone Number: ${candidate.phoneNumber}</li>
            <li>Current Status: ${candidate.currentStatus}</li>
            <li>Resume Link: ${candidate.resumeLink}</li>
            <ol>
            <div>`;
        });
    } else {
      console.log('Error fetching data', response.statusText);
    }
  } catch (err) {
    console.error('Error getting all candidates details', err);
  }
}

async function deleteCandidate (id) {
  const confirmation = confirm("Are you sure you want to delete Candidate's detals???");
    if(!confirmation) return;

    try {
      console.log(id);
      const response = await fetch(`http://localhost:5000/candidates/${id}`, {
      method: 'DELETE'
    });
      if (response.ok) {
        const data = await response.json()
        console.log('Candidate Data Deleted Successfully', data );  
        DisplayList.setAttribute('hidden','hidden'); 
        DisplayList.innerHTML = '';
      } else {
        console.log('Error deleting data', response.statusText);
      }
    } catch (err) {
      console.error('Error Deleting data', err);
    } 
}

async function editCandidate (id) {
  SubmitButton.setAttribute("hidden",'hidden');
  DisplayList.setAttribute('hidden','hidden');
  FormContent.removeAttribute('hidden');

  const response = await fetch(`http://localhost:5000/candidates/${id}`,{
  method:'GET'
  });

  const candidate = await response.json();
  CandidateId.value = candidate.data.candidateId;
  CandidateName.value = candidate.data.name;
  CandidateEmail.value = candidate.data.email;
  CandidatePhone.value = candidate.data.phoneNumber;
  CandidateStatus.value = candidate.data.currentStatus;
  CandidateResLink.value = candidate.data.resumeLink;
  UpdateButton.removeAttribute('hidden');

    UpdateButton.onclick = async (e) => {

      e.preventDefault();

      const updatedCandidate = {
      candidateId: CandidateId.value,
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

        if (response.ok) {
          const data = await response.json();
          console.log('Updated Data Successfully', data );
          FormContent.setAttribute('hidden','hidden');
        } else {
          console.log('Error updating data', response.statusText);
        }
      } catch (err) {
        console.error('Error Updating Data',err);
      }
    };

}