function formContent1 () {
  document.getElementById('formcontent1').removeAttribute('hidden');
  document.getElementById('displayjobslist').setAttribute('hidden','hidden');
  document.getElementById('submitbutton').removeAttribute('hidden');
  document.getElementById('updatebutton').setAttribute('hidden','hidden');
  document.getElementById('jobId').value = '';
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('requiredSkills').value = '';
  document.getElementById('recruiterId').value = '';
}

document.getElementById('formcontent1').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const job = {
    jobId: e.target.jobId.value,
    title: e.target.title.value,
    description: e.target.description.value,
    requiredSkills: e.target.requiredSkills.value,
    recruiterId: e.target.recruiterId.value
  }
  
  document.getElementById('formcontent1').setAttribute('hidden','hidden');
  try {
    const response = await fetch('http://localhost:5000/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(job)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Job Created Successfully', data);
    } else {
      console.log('Error Creating New Job:', response.statusText);
    }
  } catch (err) {
    console.error('Error Creating New Job:', err);
  }
});

async function getAllJobs() {

  try {
    const response = await fetch ('http://localhost:5000/jobs', {
      method: 'GET'
    });

  if (response.ok) {
    const jobs = await response.json();
    console.log('Fetched All Jobs', jobs);
    document.getElementById('displayjobslist').removeAttribute('hidden');
    document.getElementById('displayjobslist').innerHTML='';
    document.getElementById('formcontent1').setAttribute('hidden','hidden');
    jobs.data.forEach((job,index) => {
      document.getElementById('displayjobslist').innerHTML += `
      <div>
      <br/>
      <button onclick="editJob('${job._id}')">Edit</button>
      <button onclick="deleteJob('${job._id}')">Delete</button>
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
      <button onclick="applyJob('${job._id}')">APPLY</button>
      </ol>
      </div>
      ` 
    });
  } else {
    console.log('Error Fetching All Jobs:', response.statusText);
  }
  } catch (err) {
    console.error('Error Fetching Jobs:', err);
  }
}

async function deleteJob (id) {
  try {
    const response = await fetch(`http://localhost:5000/jobs/${id}`, {
      method:'DELETE'
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Job Deleted Successfully', data);
      document.getElementById('displayjobslist').setAttribute('hidden','hidden');
    } else {
      console.log('Error Deleting Job:', response.statusText);
    }
  } catch (err) {
    console.error('Error Deleting Job:', err);
  }
}

async function editJob (id) {

  document.getElementById('displayjobslist').setAttribute('hidden','hidden');
  document.getElementById('formcontent1').removeAttribute('hidden');
  document.getElementById('submitbutton').setAttribute('hidden','hidden');
  document.getElementById('updatebutton').removeAttribute('hidden');

  const response = await fetch(`http://localhost:5000/jobs/${id}`, {
    method: 'GET'
  });

  const job = await response.json();
  document.getElementById('jobId').value = job.data.jobId;
  document.getElementById('title').value = job.data.title;
  document.getElementById('description').value = job.data.description;
  document.getElementById('requiredSkills').value = job.data.requiredSkills;
  document.getElementById('recruiterId').value = job.data.recruiterId;

  document.getElementById('updatebutton').onclick = async (e) => {
    document.getElementById('formcontent1').setAttribute('hidden','hidden');
    e.preventDefault();

    const updatedJob = {
      jobId: document.getElementById('jobId').value,
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      requiredSkills: document.getElementById('requiredSkills').value,
      recruiterId: document.getElementById('recruiterId').value
    }
    
    try {
      const response = await fetch(`http://localhost:5000/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify(updatedJob)
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Updated Job Successfully', data);
      } else {
        console.log('Cannot update Job:', response.statusText);
      }
    } catch (err) {
      console.error('Server Error:', err);
    }
  }
}

async function applyJob (id) {
  const applyingJob = {
    candidateId: '68e4c2b00c07f347caf98cee'
  }
  try {
    const response = await fetch(`http://localhost:5000/jobs/${id}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(applyingJob)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Applied for job successfully', data);
    } else {
      console.log('Error applying for job', await response.json());
    }
  } catch (err) {
    console.error('Server Error:', err.message);
  }
}

function getJobDetails (JobId) {
 localStorage.setItem('selectedJobId', JobId);
 window.open('jobdetailspage.html', '_blank');
}
