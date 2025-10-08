window.addEventListener('DOMContentLoaded', async () => {
  const JobId = localStorage.getItem('selectedJobId');
  const display = document.getElementById('jobdetailsdisplay');
    if (!display) {
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
          console.log('Job Details Fetched Successfully', result);
          display.innerHTML = `
          <div>
          <ol>
            <li>Job ID: ${result.data.jobId} </li>
            <li>Title: ${result.data.title} </li>
            <li>Description: ${result.data.description}</li>
            <li>Required Skills: ${result.data.requiredSkills}</li>
            <li>Recruiter ID: ${result.data.recruiterId}</li>
          </ol>
          </div>`
        } else {
          display.innerHTML = 'Job Details Not Found';
          console.log('Error Fetching Job Details', await response.json());
        }
      
      const response1 = await fetch(`http://localhost:5000/jobs/${JobId}/applicants`, {
        method: 'GET'
      });
        if (response1.ok) {
          const result1 = await response1.json();
          console.log('Job Applicants List fetched successfully', result1);

          let candidateHTML = '';
          result1.candidates.forEach((candidate,index) => {
            candidateHTML += `<div>
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

          display.innerHTML += ` 
          <div>
              <li>${result1.job}</li>
              <li>No of Applicants: ${result1.totalApplicants}</li>
          </div>`;
          
          display.innerHTML += candidateHTML;

          }
    } catch (err) {
      console.error('Server Error', err);
    }
});
