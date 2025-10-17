const Token = localStorage.getItem('token');
const Role = localStorage.getItem('role');
const UserId = localStorage.getItem('userid');
const FormContent = document.getElementById('formcontent1');
const DisplayJob = document.getElementById('displayjobslist');
const SubmitButton = document.getElementById('submitbutton');
const UpdateButton = document.getElementById('updatebutton');
const JobId = document.getElementById('jobId');
const Title = document.getElementById('title');
const Description = document.getElementById('description');
const RequiredSkills = document.getElementById('requiredSkills');
const RecruiterId = document.getElementById('recruiterId');
const CrudStatus = document.getElementById('crudstatus1');
const JobButton = document.getElementById('jobbutton');
const JobFormButton = document.getElementById('jobformbutton');

window.addEventListener('DOMContentLoaded', () => {
  if (!Token || !UserId) {
    window.location.href = 'loginpage.html';
  }
});

if (Role === 'Candidate' || Role === 'Hiring_Manager') {
  JobFormButton.hidden = true;
  JobButton.hidden = true;
  
} 

function formContent1 () {
  FormContent.hidden = false;
  DisplayJob.hidden = true;
  SubmitButton.hidden = false;
  UpdateButton.hidden = true;
  JobId.value = '';
  Title.value = '';
  Description.value = '';
  RequiredSkills.value = '';
  RecruiterId.value = '';
  CrudStatus.hidden = true;
  if ( Role !== 'Candidate'){  
    JobButton.hidden = false;
    JobFormButton.hidden = true;
  }
}

FormContent.addEventListener('submit', async (e) => {
  e.preventDefault();

  const job = {
    jobId: e.target.jobId.value,
    title: e.target.title.value,
    description: e.target.description.value,
    requiredSkills: e.target.requiredSkills.value,
    recruiterId: e.target.recruiterId.value
  };

  FormContent.hidden = true;
  try {
    const response = await fetch('http://localhost:5000/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(job)
    });
    CrudStatus.hidden = false;
    await response.json();
    if (response.ok) {
      CrudStatus.innerHTML = 'New Job Created Successfully!!!'
    } else {
        CrudStatus.innerHTML = 'Error Created New Job!!!'
    }
  } catch (err) {
      console.error('Error Creating New Job:', err);
  }
});

window.addEventListener('DOMContentLoaded',getAllJobs);

async function getAllJobs() {
  if ( Role !== 'Candidate' && Role !== 'Hiring_Manager') {
    JobButton.hidden = true;
    JobFormButton.hidden = false;
  }
  try {
    const response = await fetch ('http://localhost:5000/jobs', {
      method: 'GET'
    });
    const jobs = await response.json();
    CrudStatus.hidden = false;
    if (response.ok) {
      CrudStatus.innerHTML = 'Successfully fetched all jobs';
      DisplayJob.hidden = false;
      DisplayJob.innerHTML='';
      FormContent.hidden = true;
        jobs.data.forEach((job,index) => {
          DisplayJob.innerHTML += `
          <div>
            <br/>
            <button class="editbutton1" onclick="editJob('${job._id}')">Edit</button>
            <button class="deletebutton1" onclick="deleteJob('${job._id}')">Delete</button>
          </div>
          <div>
            <ol>
              <li>Job ${index+1}</li>
              <li>Title: ${job.title}</li>
              <li>Required Skills: ${job.requiredSkills}</li>
              <a href="#" id="more" onclick="getJobDetails('${job._id}')">
                <div>More...</div>
              </a>
              <br/>
              <button class="applybutton1" onclick="applyJob('${job._id}')">APPLY</button>
            </ol>
          </div> ` 
        });
        if (Role === 'Candidate') {
          document.querySelectorAll('.editbutton1, .deletebutton1').forEach(button => {
            button.hidden = true;
        });
        } else if (Role === 'Recruiter'){
            document.querySelectorAll('.deletebutton1, .applybutton1').forEach(button => {
              button.hidden = true;
            });
        } else if (Role === 'Hiring_Manager') {
            document.querySelectorAll('.editbutton1, .deletebutton1, .applybutton1').forEach(button => {
              button.hidden = true;
            });
        } else {
            document.querySelectorAll('.applybutton1').forEach(button => {
              button.hidden = true;
            });
        }
    } else {
        CrudStatus.innerHTML = 'Error Fetching All Jobs';
    }
  } catch (err) {
      console.error('Error Fetching Jobs:', err);
  }
};

async function deleteJob (id) {
  const confirmation = confirm('Are you sure you want to delete this Job?????');
  if (!confirmation) return;

  try {
    const response = await fetch(`http://localhost:5000/jobs/${id}`, {
      method:'DELETE'
  });

  await response.json();
  CrudStatus.hidden = false;
  if (response.ok) {
    CrudStatus.innerHTML = 'Job Deleted Successfully';
    DisplayJob.hidden = true;
    JobFormButton.hidden = true;
    JobButton.hidden = false;
  } else {
      CrudStatus.innerHTML = 'Error Deleting Job';
  }
  } catch (err) {
      console.error('Error Deleting Job:', err);
  }
};

async function editJob (id) {
  CrudStatus.hidden = true;
  JobButton.hidden = false;
  JobFormButton.hidden = true;
  DisplayJob.hidden = true;
  FormContent.hidden = false;
  SubmitButton.hidden = true;
  UpdateButton.hidden = false;

  const response = await fetch(`http://localhost:5000/jobs/${id}`, {
    method: 'GET'
  });

  const job = await response.json();
  JobId.value = job.data.jobId;
  Title.value = job.data.title;
  Description.value = job.data.description;
  RequiredSkills.value = job.data.requiredSkills;
  RecruiterId.value = job.data.recruiterId;

  UpdateButton.onclick = async (e) => {
    FormContent.hidden = true;
    e.preventDefault();

    const updatedJob = {
      jobId: JobId.value,
      title: Title.value,
      description: Description.value,
      requiredSkills: RequiredSkills.value,
      recruiterId: RecruiterId.value
    }

    try {
      const response = await fetch(`http://localhost:5000/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify(updatedJob)
      });
      await response.json();
      CrudStatus.hidden = false;
      if (response.ok) {
        CrudStatus.innerHTML = 'Updated Job Successfully';
      } else {
          CrudStatus.innerHTML = 'Cannot Update Job';
      }
    } catch (err) {
        console.error('Server Error:', err);
    }
  }
}

async function applyJob (id) {
  try {
  const response = await fetch(`http://localhost:5000/jobs/${id}/apply`, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
    },
    body: JSON.stringify({ userId: UserId, currentStatus: 'Applied'})
  });

  const data = await response.json();
  CrudStatus.hidden = false;
  if (response.ok) {
    CrudStatus.innerHTML = 'Applied for job successfully';
    JobButton.hidden = true;
      if ( Role !== 'Candidate' && Role !== 'Hiring_Manager') JobFormButton.hidden = false; 
  } else if (data.message === 'Already applied') {
      CrudStatus.innerHTML = 'You have already applied for this Job!!! Apply New Jobs';
  } else if (data.message === 'Candidate Not Found'){
      CrudStatus.innerHTML = 'You must fill the Candidate Details First!!!';
  } else {
      CrudStatus.innerHTML = 'Error applying for job';
  }
  } catch (err) {
      console.error('Server Error:', err);
  }
}

function getJobDetails (JobId) {
  localStorage.setItem('selectedJobId', JobId);
  window.location.href = 'jobdetailspage.html';
}

function LogOut () {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userid');
  window.location.href = 'loginpage.html';
}