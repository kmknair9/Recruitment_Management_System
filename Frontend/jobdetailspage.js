const Token = localStorage.getItem('token');
const Role = localStorage.getItem('role');
const UserId = localStorage.getItem('userid');
const CrudStatus = document.getElementById('crudstatus2');
const Display = document.getElementById('jobdetailsdisplay');

window.addEventListener('DOMContentLoaded', async () => {
  if (!Token) {
    window.location.href = 'loginpage.html';
  }

  const JobId = localStorage.getItem('selectedJobId');
  if (!Display) {
    console.log('Element in Page is not fetched');
    return;
  }
  if (!JobId) {
    console.log('Job Id not fetched Successfully');
    return;
  }

  try {
    const response =  await fetch(`http://localhost:5000/jobs/${JobId}`, {
      method: 'GET'
    });
  if (response.ok) {
    const result =  await response.json();
    Display.innerHTML = `
    <div>
      <ol>
        <li>Job ID: ${result.data.jobId} </li>
        <li>Title: ${result.data.title} </li>
        <li>Description: ${result.data.description}</li>
        <li>Required Skills: ${result.data.requiredSkills}</li>
        <li>Recruiter ID: ${result.data.recruiterId}</li>
        <br/>
        <button id="applybutton1" onclick="applyJob('${JobId}')">APPLY</button>
      </ol>
    </div>`
    if (Role === 'Admin' || Role === 'Recruiter' || Role === 'Hiring_Manager') {
      document.getElementById('applybutton1').hidden = true;
    }

  } else {
    Display.innerHTML = 'Job Details Not Found';
  }

  const response1 = await fetch(`http://localhost:5000/jobs/${JobId}/applicants`, {
    method: 'GET'
  });
  const result1 = await response1.json();
  CrudStatus.hidden = false;
  if (response1.ok && Role !== 'Candidate') {
    CrudStatus.innerHTML = 'Job Applicants List fetched successfully';
    let candidateHTML = '';
    if (Role === 'Admin' || Role === 'Recruiter' || Role === 'Hiring_Manager') {
      result1.candidates.forEach((candidate,index) => {
      candidateHTML += `
      <div>
      <br/>
        <ol>
          <li>Candidate ${index+1}</li>
          <li>Candidate ID: ${candidate.candidateId}</li>
          <li>Name: ${candidate.name} </li>
          <li>Email: ${candidate.email}</li>
          <li>Contact: ${candidate.phoneNumber}</li>
          <li>Status: ${candidate.currentStatus}</li>
          <li>Resume: ${candidate.resumeLink}</li>
        </ol>
      </div>`
      });

      Display.innerHTML += ` 
      <div>
        <li>${result1.job}</li>
        <li>No of Applicants: ${result1.totalApplicants}</li>
      </div>`;

      Display.innerHTML += candidateHTML;
   }

  }
  } catch (err) {
      console.error('Server Error', err);
  }
});

async function applyJob (id) {
  if (!UserId) {
    console.error('User Id is not in Local Storage');
    return;
  }
  try {
  const response = await fetch(`http://localhost:5000/jobs/${id}/apply`, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify({ userId: UserId})
  });
  const data = await response.json();
  CrudStatus.hidden = false;
  if (response.ok) {
    CrudStatus.innerHTML = 'Applied for job successfully';
  } else if (data.message === 'Already applied'){
      CrudStatus.innerHTML = 'You have already applied for this Job!!! Apply New Jobs'
  } else if (data.message === 'Candidate Not Found'){
      CrudStatus.innerHTML = 'You must fill the Candidate Details First!!!'
  } else {
      CrudStatus.innerHTML = 'Error applying for job';
  }
  } catch (err) {
      console.error('Server Error:', err);
  }
}

function LogOut () {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userid');
  window.location.href = 'loginpage.html';
}
