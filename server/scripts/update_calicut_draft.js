const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
const Blog = require('../models/blogModel');

const CALICUT_EXPANDED_CONTENT = `
<p style="text-align: justify;"><strong>Calicut University Distance Education Admission 2026:</strong> The School of Distance Education (SDE) at the University of Calicut has officially announced the commencement of admissions for its diverse undergraduate and postgraduate programs for the 2026-27 academic batch. Prospective students and working professionals can enroll across popular disciplines including BA, B.Com, BBA, BCA, MA, M.Com, MBA, and Master of Social Work (MSW). The registration processing fee is <strong>₹300</strong> for all academic streams. Annual tuition fees for undergraduate degree courses range from <strong>₹3,000 to ₹8,000</strong>, while postgraduate programs range between <strong>₹5,000 and ₹15,000</strong> per year, maintaining unmatched affordability. Admissions are conducted purely on a merit basis without mandatory entrance examinations. The University of Calicut holds an esteemed <strong>NAAC 'A++' Grade accreditation</strong> and is fully recognized by the <strong>UGC-DEB</strong> (Distance Education Bureau). The official distance education portal is <strong>uoc.ac.in</strong> (or <strong>cdoe.uoc.ac.in</strong>), and eligible candidates can submit their online registration before the scheduled deadline.</p>

<p style="text-align: justify;">Established in 1968 and situated in Thenhipalam, Malappuram district, Kerala, the University of Calicut is Kerala's largest state university. The School of Distance Education operates a dedicated network of <strong>over 150 study centres</strong> across Kerala and Lakshadweep, extending high-quality tertiary education to learners in remote areas and full-time employment. The institution secured <strong>Rank 51 nationwide in NIRF 2024</strong> among universities. Its student training and career guidance wing collaborates with top-tier corporate recruiters such as <strong>TCS, Infosys, Wipro, Federal Bank, HDFC Bank, and BSNL</strong>, with graduating students securing entry-level compensation packages averaging <strong>₹3.5 to ₹5.0 LPA</strong>. Distance learning degrees awarded by Calicut University maintain full equivalence with regular on-campus qualifications.</p>

<h3 style="text-align: justify; font-weight: 700;"><strong style=""><font color="#2563eb">Calicut University Distance Education Latest Updates 2026:</font></strong></h3><ul style="margin: 8px 0px 0px; padding: 0px 0px 0px 20px; line-height: 1.6;"><li style="text-align: justify;">Applications are ongoing for the admission at <b style="">Calicut University Distance Education </b>for 2026-27 session. Apply before the end date of <b style="">30 October 2026*</b>.</li></ul><h2></h2>

<h2 style="text-align: justify;">Calicut University Distance Education Overview</h2>
<ul style="text-align: justify;">
  <li style="margin-bottom: 8px;"><strong>UG Eligibility:</strong> Applicants seeking admission to BA and general undergraduate programs require a 10+2 / Higher Secondary certificate with a minimum of 40% aggregate marks from a recognized state or central board. Students from Arts, Science, and Commerce streams can apply for relevant undergraduate degree programs.</li>
  <li style="margin-bottom: 8px;"><strong>PG Eligibility:</strong> Candidates must hold an accredited Bachelor's degree with at least <strong>45% aggregate marks</strong> in the relevant discipline from a UGC-recognized university. Statutory percentage relaxations are extended to SC, ST, OBC, and PwD candidates as per Kerala government guidelines.</li>
  <li style="margin-bottom: 8px;"><strong>Entrance Exam:</strong> Calicut University SDE does not conduct entrance evaluations for regular distance programs. <strong>Merit-based direct admission</strong> is granted based on the marks secured in the last qualifying examination.</li>
  <li style="margin-bottom: 8px;"><strong>Admission Criteria:</strong> The university publishes official course-wise merit ranks following digital document verification. Allocation of seats is strictly dependent on qualifying examination performance and adherence to reservation rules.</li>
  <li style="margin-bottom: 8px;"><strong>Average Fee:</strong> Undergraduate programs range between <strong>₹3,000 and ₹8,000 per year</strong>, whereas postgraduate programs require an annual fee of <strong>₹5,000 to ₹15,000</strong>, ensuring high-quality, subsidized state education.</li>
  <li style="margin-bottom: 8px;"><strong>Application Process:</strong> Candidates must register online on the official university portal at <strong>uoc.ac.in</strong>, fill out personal and academic credentials, upload scanned certificates, remit the processing fee via online payment gateway, and verify enrollment status.</li>
  <li style="margin-bottom: 8px;"><strong>Regulatory Approvals:</strong> Calicut University holds <strong>UGC recognition</strong> under Section 12-B, <strong>UGC-DEB approval</strong> for distance learning, <strong>NAAC 'A++' Grade</strong> accreditation, and institutional membership in the <strong>Association of Indian Universities (AIU)</strong>.</li>
  <li style="margin-bottom: 8px;"><strong>Reservation Policy:</strong> Reservation quotas follow Government of Kerala mandates: <strong>15% for SC/ST</strong>, <strong>27% for OBC</strong>, and <strong>10% for Economically Weaker Sections (EWS)</strong>.</li>
  <li style="margin-bottom: 8px;"><strong>Placement Support:</strong> Active placement collaborations with <strong>TCS, Infosys, Wipro, Federal Bank, HDFC Bank, and BSNL</strong> offer graduating learners recruitment opportunities with initial salary packages between <strong>₹3.5 and ₹5.0 LPA</strong>.</li>
</ul>

<h2 style="text-align: justify;">About Calicut University Distance Education</h2>
<p style="text-align: justify;">The School of Distance Education at the University of Calicut was established in <strong>1981</strong> to democratize higher learning across the Malabar region and throughout Kerala. Operating from its headquarters in <strong>Malappuram, Kerala</strong>, the university is recognized among India's premier public institutions, holding <strong>NIRF 2024 Rank 51</strong> and a top-grade <strong>NAAC 'A++' accreditation</strong>. The institution maintains statutory recognitions from the <strong>UGC, AICTE, and UGC-DEB</strong>. The university comprises <strong>28 dedicated academic departments</strong> across Humanities, Science, Commerce, Management Studies, and Legal Education.</p>

<p style="text-align: justify;">Calicut University maintains institutional partnerships with over <strong>50 industries and research bodies</strong> to facilitate student field exposure and collaborative academic projects. It also conducts advanced doctoral research across <strong>40+ academic subjects</strong>. Deserving students can avail institutional fee scholarships covering <strong>up to 50% of tuition fees</strong> based on merit and financial need. Through its state-of-the-art Learning Management System (LMS), distance learners access <strong>recorded lecture archives, digital textbooks, and comprehensive study materials</strong> 24/7. In total, the distance education wing coordinates more than <strong>150 undergraduate, postgraduate, diploma, and certificate programs</strong>.</p>

<h2 style="text-align: justify;">Calicut University Distance Education UG Admission 2026</h2>
<p style="text-align: justify;">Admissions for Calicut University Distance Education UG programs for the 2026-27 academic session are active. The School of Distance Education offers popular undergraduate degree programs such as <strong>BA, B.Com, BBA, BCA, and B.Sc</strong>. Candidates who have passed their 10+2 / Plus Two examination from an accredited secondary education board with a minimum of 40% aggregate marks are eligible to enroll. The annual fee for undergraduate degrees ranges between <strong>₹6,000 and ₹15,000</strong> per year depending on the chosen specializations and laboratory components. Prospective applicants can register online via the official portal at <strong>cdoe.uoc.ac.in</strong> or <strong>uoc.ac.in</strong> before the closing date.</p>

<h3 style="text-align: justify;">Calicut University Distance Education BA Admission 2026</h3>
<p style="text-align: justify;">The Bachelor of Arts (B.A.) program delivers extensive academic grounding in English, Malayalam, Hindi, Arabic, History, Economics, and Sociology. In literature streams, the syllabus covers British Poetry, American Literature, Indian Writing in English, and Literary Criticism comprehensively, fostering analytical reading and professional writing competence. To be eligible, candidates require <strong>at least 40% marks in 10+2</strong> from any recognized Science, Commerce, or Arts stream. The course spans <strong>3 academic years (6 semesters)</strong> with an affordable annual tuition fee of approximately <strong>₹3,800 per year</strong>.</p>

<p style="text-align: justify;">The curriculum encompasses in-depth modules on Shakespearean drama, Romantic poetry, Modern theater, Contemporary world fiction, and structural linguistics. Student progress is evaluated through a balanced combination of <strong>internal assignments, semester-end written examinations, and project reports</strong>. BA graduates are well-prepared for competitive careers in <strong>school and collegiate teaching, journalism, digital content writing, publishing houses, and civil services (UPSC/Kerala PSC)</strong>, commanding initial starting salaries ranging from <strong>₹2.5 to ₹4.0 LPA</strong>.</p>

<h3 style="text-align: justify;">Calicut University Distance Education BCom Admission 2026</h3>
<p style="text-align: justify;">The Bachelor of Commerce (B.Com) program provides rigorous training in Financial Accounting, Cost Accounting, Corporate Law, and Business Economics. Core coursework emphasizes <strong>Income Tax regulations, Goods and Services Tax (GST) compliance, Auditing standards</strong>, and <strong>Corporate Financial Management</strong>. Eligibility requires a minimum of <strong>40% aggregate in 10+2</strong> with Commerce, Accountancy, or Mathematics as qualifying subjects. The program is structured over <strong>3 academic years</strong> with an economical annual fee of around <strong>₹4,500 per year</strong>.</p>

<p style="text-align: justify;">Practical training modules integrate modern computerized accounting, including <strong>Tally ERP software, advanced Excel modeling for finance</strong>, and real-world financial statement interpretation. Final-year students are encouraged to complete practical internships with accounting firms and corporate business houses. Graduating students qualify for immediate employment as <strong>Accountants, Tax Consultants, Internal Auditors, and Financial Analysts</strong> with compensation packages typically between <strong>₹3.0 and ₹6.0 LPA</strong>, while creating strong fundamentals for CA, CMA, and CS certifications.</p>

<h3 style="text-align: justify;">Calicut University Distance Education BBA Admission 2026</h3>
<p style="text-align: justify;">The Bachelor of Business Administration (BBA) curriculum prepares students for executive and managerial career paths. Foundational courses include Business Communication, Marketing Management, Human Resource Management, and Organizational Behavior. Advanced modules explore <strong>Entrepreneurship development, Corporate Governance &amp; Ethics</strong>, and <strong>Strategic Management</strong>. Candidates with <strong>40% marks in 10+2</strong> from any academic stream qualify for admission. The course duration is <strong>3 academic years</strong> with an estimated annual investment of <strong>₹6,200 per year</strong>.</p>

<p style="text-align: justify;">The pedagogy incorporates real-world corporate case studies, collaborative team projects, and industrial analysis. The curriculum is tailored to sharpen leadership acumen, quantitative decision-making, and critical business problem-solving skills. Upon graduation, learners step into positions such as <strong>Business Development Executives, HR Coordinators, Sales Managers, and Operations Supervisors</strong>, earning entry packages between <strong>₹3.5 and ₹5.0 LPA</strong>.</p>

<h2 style="text-align: justify;">Calicut University PG Distance Education Admission 2026</h2>
<p style="text-align: justify;">Postgraduate admissions at Calicut University SDE for the 2026-27 cycle are open for diverse master's programs, including <strong>M.Com, MBA, M.Sc, M.A., and MSW</strong>. Candidates seeking admission to PG courses must possess a recognized Bachelor's degree with a minimum of 45% aggregate marks from a UGC-approved university (with relaxations for reserved categories). All PG courses span <strong>2 academic years</strong> divided into <strong>4 semesters</strong>. Distance postgraduate tuition fees at Calicut University range from <strong>₹6,000 to ₹15,000 per year</strong>. Candidates are encouraged to complete their online application on the official university portal prior to the deadline.</p>

<h3 style="text-align: justify;">Calicut University Distance Education MCom Admission 2026</h3>
<p style="text-align: justify;">The Master of Commerce (M.Com) degree offers specialized tracks in Finance, Accounting, Marketing, and International Taxation. Coursework covers <strong>Advanced Corporate Accounting, Corporate Financial Strategy, Business Research Methods, Quantitative Statistics</strong>, and Strategic Management. Applicants must hold a <strong>B.Com or BBA / BA Commerce degree with at least 45% marks</strong>. The program spans <strong>2 academic years</strong> with an annual fee of approximately <strong>₹7,800 per year</strong>.</p>

<p style="text-align: justify;">Advanced syllabus components focus on <strong>Portfolio Management, Financial Derivatives, International Banking, and E-Commerce Business Models</strong>. Learners complete corporate internships with commercial banking institutions, asset management corporations, or chartered accounting firms. Career pathways include <strong>Financial Controllers, Investment Banking Analysts, Senior Tax Consultants, and Collegiate Faculty (via UGC-NET/JRF)</strong>, with lucrative annual packages ranging from <strong>₹5.0 to ₹12.0 LPA</strong>.</p>

<h3 style="text-align: justify;">Calicut University Distance Education MSW Admission 2026</h3>
<p style="text-align: justify;">The Master of Social Work (MSW) curriculum is crafted for graduates dedicated to community welfare, human rights, and social intervention. Core thematic areas address <strong>Community Development, Child Protection, Medical &amp; Psychiatric Social Work, Women Empowerment, and Disaster Relief Management</strong>. Candidates with a <strong>Bachelor's degree with 45% marks</strong> in any discipline are eligible. The <strong>2-year postgraduate program</strong> requires a tuition fee of approximately <strong>₹7,000 per year</strong>.</p>

<p style="text-align: justify;">Fieldwork is a cornerstone of the MSW curriculum, mandating <strong>supervised concurrent fieldwork internships with reputed NGOs, public health centers, and governmental welfare agencies</strong>, along with a minimum requirement of <strong>100 hours of community outreach service</strong>. Graduates secure fulfilling positions as <strong>Social Welfare Officers, Clinical Counselors, CSR Project Managers, and International NGO Coordinators</strong>, earning annual packages between <strong>₹3.0 and ₹6.0 LPA</strong>.</p>

<h2 style="text-align: justify;">Calicut University Distance Education Diploma Admission 2026</h2>
<p style="text-align: justify;">Calicut University offers 1-year career diploma courses designed to impart focused professional and technical skills:</p>
<ul style="text-align: justify;">
  <li style="margin-bottom: 8px;"><strong>Diploma in Computer Applications (DCA):</strong> Covers office automation, Internet architecture, computer programming fundamentals, and database management systems. Open to candidates with <strong>40% marks in 10+2</strong> from any stream. The <strong>1-year course fee is ₹5,000</strong> with merit-based enrollment.</li>
  <li style="margin-bottom: 8px;"><strong>Diploma in Journalism and Mass Communication:</strong> Emphasizes print news reporting, broadcast media, copy editing, feature writing, and digital multimedia journalism. Eligibility requires <strong>40% in 10+2</strong>. Total fee is <strong>₹6,500 for 1 year</strong> based on qualifying examination marks.</li>
  <li style="margin-bottom: 8px;"><strong>Diploma in Library and Information Science (CLISc):</strong> Covers foundational library administration, cataloguing standards, Dewey classification, and digital library databases. Requires <strong>40% in 10+2</strong> with a fee of <strong>₹4,800 for 1 year</strong>.</li>
</ul>

<h2 style="text-align: justify;">Calicut University Distance Education PG Diploma Admission 2026</h2>
<p style="text-align: justify;">One-year Postgraduate Diploma courses are tailored for graduates seeking rapid professional specialization:</p>
<ul style="text-align: justify;">
  <li style="margin-bottom: 8px;"><strong>PG Diploma in Human Resource Management (PGDHRM):</strong> Examines talent acquisition, employee training &amp; development, labor laws, performance appraisal, compensation design, and organizational behavior. Requires <strong>graduation with 45%</strong>. Total program fee is <strong>₹8,000 for 1 year</strong>.</li>
  <li style="margin-bottom: 8px;"><strong>PG Diploma in Financial Management (PGDFM):</strong> Covers corporate finance, capital budgeting, working capital strategies, financial markets, and portfolio risk management. Open to <strong>any graduate with 45%</strong> with a fee of <strong>₹9,500 for 1 year</strong>.</li>
  <li style="margin-bottom: 8px;"><strong>PG Diploma in Information Technology (PGDIT):</strong> Focuses on programming in Python and Java, SQL database systems, web development, and cloud computing principles. Eligibility requires <strong>graduation with 45%</strong>. Course fee is <strong>₹10,500 for 1 year</strong>.</li>
  <li style="margin-bottom: 8px;"><strong>PG Diploma in Journalism and Mass Communication (PGDJMC):</strong> Advanced training in investigative reporting, broadcast journalism, media jurisprudence, public relations, and corporate communications. Requires a <strong>Bachelor's degree with 45%</strong>. Total fee is <strong>₹8,800 for 1 year</strong>.</li>
</ul>

<h2 style="text-align: justify;">Calicut University Distance Education Certificate Admission 2026</h2>
<p style="text-align: justify;">Short-term 6-month certificate programs offer targeted competency certifications for students and working professionals:</p>
<ul style="text-align: justify;">
  <li style="margin-bottom: 8px;"><strong>Certificate in Computer Applications:</strong> Equips students with foundational computing, MS Office, internet utilities, and digital workspace literacy. Requires <strong>35% in 10+2</strong> with a 6-month fee of <strong>₹3,000</strong>.</li>
  <li style="margin-bottom: 8px;"><strong>Certificate in Spoken English:</strong> Focuses on phonetics, pronunciation, conversational fluency, public speaking, and business communication. Requires <strong>33% in 10+2</strong> with a fee of <strong>₹2,500 for 6 months</strong>.</li>
  <li style="margin-bottom: 8px;"><strong>Certificate in Accounting:</strong> Practical grounding in corporate financial accounting, Tally accounting software, GST returns, and basic tax filing. Requires <strong>35% in 10+2</strong> with a fee of <strong>₹4,000 for 6 months</strong>.</li>
  <li style="margin-bottom: 8px;"><strong>Certificate in Digital Marketing:</strong> Covers search engine optimization (SEO), social media marketing, content marketing strategy, and email campaigns. Requires <strong>33% in 10+2</strong> with a fee of <strong>₹5,500 for 6 months</strong>.</li>
  <li style="margin-bottom: 8px;"><strong>Certificate in Cyber Security:</strong> Fundamentals of network security, ethical hacking, information protection, and digital risk mitigation. Requires <strong>35% in 10+2</strong> with a fee of <strong>₹6,000 for 6 months</strong>.</li>
</ul>

<h2 style="text-align: justify;">Calicut University Distance Education Courses and Fees</h2>
<p style="text-align: justify;">Below is the comprehensive list of popular undergraduate and postgraduate courses offered through the School of Distance Education, along with duration and estimated yearly fee schedules:</p>

<div class="blog-table-responsive">
  <table style="text-align: justify; width: 100%; border-collapse: collapse; margin: 16px 0px;">
    <thead>
      <tr style="background:#f1f5f9; text-align:left;">
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Course Name</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Duration</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Fee Range</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>BA (English, Malayalam, Hindi, History, Economics)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹3,500–₹4,000/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>BCom (Accounting, Business Management)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹4,200–₹5,000/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>BBA (Business Administration)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹5,500–₹6,500/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>BSc (Mathematics, Physics, Chemistry, Biology)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹4,800–₹5,800/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>BCA (Computer Applications)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹6,000–₹7,000/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>BSW (Social Work)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹4,000–₹4,800/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>MA (English, Malayalam, Hindi, History, Political Science)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">2 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹6,000–₹7,500/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>MCom (Financial Management, Business Administration)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">2 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹7,500–₹8,500/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>MBA (Finance, Marketing, HR, International Business)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">2 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹12,000–₹15,000/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>MSc (Mathematics, Physics, Chemistry)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">2 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹8,000–₹10,000/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>MSW (Social Work, Community Development)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">2 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹6,500–₹7,500/year</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 style="text-align: justify;">How to Apply for Calicut University Distance Education Admission 2026?</h2>
<ul style="text-align: justify;">
  <li style="margin-bottom: 8px;"><strong>Step 1: Access the official portal</strong> at <strong>uoc.ac.in</strong> (or <strong>cdoe.uoc.ac.in</strong>) and navigate to the Distance Education section. Click on the <strong>Admissions 2026</strong> link to access the registration portal. Read all instructions carefully before starting.</li>
  <li style="margin-bottom: 8px;"><strong>Step 2: Create your account</strong> by providing an active mobile number and valid email address. Generate a secure password and complete OTP verification. Retain your login credentials for tracking application status.</li>
  <li style="margin-bottom: 8px;"><strong>Step 3: Enter application details</strong> accurately, including personal information, contact address, qualifying examination marks, and community reservation category. Select your preferred course, specialization, and nearest study/examination centre.</li>
  <li style="margin-bottom: 8px;"><strong>Step 4: Upload required files</strong> including a recent passport-sized photograph with a white background, scanned digital signature, 10th certificate, 12th certificate, degree mark list (for PG programs), category certificate (if applicable), and Aadhaar Card. Ensure files are in PDF or JPEG format under 200 KB.</li>
  <li style="margin-bottom: 8px;"><strong>Step 5: Complete fee payment</strong> of ₹300 processing fee through UPI, net banking, debit card, or credit card. Complete the transaction and download the official payment confirmation slip with transaction ID.</li>
  <li style="margin-bottom: 8px;"><strong>Step 6: Submit your application</strong> after reviewing all entered details. Download and print the completed application form and fee receipt. Verify that you have received confirmation via SMS and email.</li>
</ul>

<h3 style="text-align: justify;">Required Documents for Admission</h3>
<p style="text-align: justify;">Ensure that the following self-attested documents are kept ready for upload and subsequent physical verification:</p>
<ul style="text-align: justify;">
  <li style="margin-bottom: 8px;"><strong>Recent photograph:</strong> Passport-size with a clean white background, in JPEG format under 50 KB. Image must clearly display face without dark glasses or headgear (except religious).</li>
  <li style="margin-bottom: 8px;"><strong>Scanned signature:</strong> On plain white paper using a black ink pen, JPEG format under 20 KB. Must match signatures across all official records.</li>
  <li style="margin-bottom: 8px;"><strong>Identity proof:</strong> Valid government-issued photo ID such as Aadhaar Card, Passport, Voter ID, or PAN Card in PDF format under 100 KB.</li>
  <li style="margin-bottom: 8px;"><strong>10th standard documents:</strong> SSLC / Matriculation marksheet and certificate indicating date of birth and student name, PDF format under 200 KB.</li>
  <li style="margin-bottom: 8px;"><strong>12th standard documents:</strong> Plus Two (+2) / Higher Secondary marksheet and passing certificate, PDF format under 200 KB. (PG applicants must also upload bachelor's degree certificate and consolidated mark list).</li>
  <li style="margin-bottom: 8px;"><strong>Transfer Certificate (TC) / Migration Certificate:</strong> Issued by the last institution attended, PDF format under 150 KB.</li>
  <li style="margin-bottom: 8px;"><strong>Category Certificate:</strong> For SC, ST, OBC, or EWS candidates issued by a competent revenue authority, PDF format under 150 KB.</li>
  <li style="margin-bottom: 8px;"><strong>Domicile Certificate:</strong> (If required) from the competent Tahsildar / Revenue Department confirming Kerala domicile, PDF format under 100 KB.</li>
</ul>

<h3 style="text-align: justify;">FAQ's:</h3>
<p style="text-align: justify;"><strong>Q: Is an entrance exam required for admission to Calicut University Distance Education?</strong></p>
<p style="text-align: justify;"><strong>A:</strong> No, entrance examinations are not conducted for regular undergraduate, postgraduate, diploma, or certificate programs at Calicut University SDE. Admission is granted directly on the basis of marks secured in the qualifying examinations.</p>

<p style="text-align: justify;"><strong>Q: What is the application fee for distance courses at Calicut University?</strong></p>
<p style="text-align: justify;"><strong>A:</strong> The standard registration and application processing fee is <strong>₹300</strong> for all programs. This non-refundable fee must be remitted online during the application submission.</p>

<p style="text-align: justify;"><strong>Q: Are Calicut University distance education degrees valid for government jobs?</strong></p>
<p style="text-align: justify;"><strong>A:</strong> Yes, absolutely. Calicut University is a recognized state university holding <strong>UGC-DEB approval</strong> and an <strong>NAAC 'A++' Grade</strong>. All degrees are fully valid for central government jobs, state PSC recruitments (including Kerala PSC and UPSC), banking examinations, and international certificate attestation.</p>

<p style="text-align: justify;"><strong>Q: Can I change my study centre after admission?</strong></p>
<p style="text-align: justify;"><strong>A:</strong> Yes. Students can submit a formal center-change application addressed to the Director of the School of Distance Education. Approval is subject to seat availability and administrative clearance at the requested center.</p>

<p style="text-align: justify;"><strong>Q: Does Calicut University offer distance education degrees?</strong></p>
<p style="text-align: justify;"><strong>A:</strong> Yes, Calicut University provides comprehensive distance learning programs through its School of Distance Education (SDE / CDOE). All courses are officially approved by UGC-DEB and AICTE.</p>

<p style="text-align: justify;"><strong>Q: What is the last date for Calicut University Distance Education Admission 2026?</strong></p>
<p style="text-align: justify;"><strong>A:</strong> The Calicut University admission process is active, and the tentative closing deadline for submitting online applications is <strong>30 October 2026*</strong>.</p>
`;

async function updateCalicut() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas');

  const updatedBlog = await Blog.findOneAndUpdate(
    { slug: 'calicut-university-distance-education' },
    {
      $set: {
        content: CALICUT_EXPANDED_CONTENT,
        metaTitle: 'Calicut University Distance Education Admission 2026 | Last Date, Fees & Process',
        metaDescription: 'Complete guide to Calicut University Distance Education (SDE) 2026. Explore BA, B.Com, BBA, MA, M.Com, MBA, MSW fees, eligibility criteria, and step-by-step application instructions.',
        excerpt: 'School of Distance Education (SDE), University of Calicut, has announced admissions for 2026. Review undergraduate and postgraduate programs, annual fee schedules, eligibility parameters, and online registration instructions.',
        updatedDate: new Date()
      }
    },
    { returnDocument: 'after' }
  );

  if (updatedBlog) {
    console.log('Successfully updated Calicut blog in MongoDB!');
    console.log('New Content Length:', updatedBlog.content.length);
    console.log('Status:', updatedBlog.status);
    console.log('Published:', updatedBlog.published);
  } else {
    console.error('Calicut blog not found with slug calicut-university-distance-education');
  }

  process.exit(0);
}

updateCalicut().catch(err => {
  console.error(err);
  process.exit(1);
});
