const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });
const Blog = require('../models/blogModel');

const TNOU_EXPANDED_CONTENT = `
<p><strong>TNOU Distance Education Admission 2026:</strong> Tamil Nadu Open University (TNOU), Chennai, has officially commenced the admission process for its extensive range of undergraduate (UG), postgraduate (PG), professional diploma, postgraduate diploma, and vocational certificate programs for the 2026-27 academic session. Catering to working executives, homemakers, rural learners, and students seeking flexible distance education, TNOU offers accredited degrees with direct admission based on merit. Interested applicants are encouraged to submit their online application forms before the scheduled deadline of <strong>20 October 2026*</strong>.</p>

<p>Established in 2002 by the Legislative Assembly of the Government of Tamil Nadu under Act No. 27 of 2002, TNOU is a premier State Open University accredited with an esteemed <strong>NAAC 'A+' Grade</strong>. The university is fully recognized by the <strong>University Grants Commission (UGC)</strong>, the <strong>Distance Education Bureau (UGC-DEB)</strong>, the <strong>All India Council for Technical Education (AICTE)</strong>, the <strong>National Council for Teacher Education (NCTE)</strong>, and the <strong>Rehabilitation Council of India (RCI)</strong>. Operating from its central administrative headquarters at Anna Salai, Saidapet, Chennai, TNOU maintains 12 academic schools, 8 regional centres, and over 50 community colleges across Tamil Nadu.</p>

<div class="blog-table-responsive" style="background:#f8fafc; border-left:4px solid #2563eb; padding:16px 20px; margin:22px 0; border-radius:6px;">
  <p style="margin:0; font-weight:700; color:#1e293b; font-size:17px;"><strong>Tamil Nadu Open University Admission 2026 Latest Updates:</strong></p>
  <ul style="margin:10px 0 0 0; padding-left:20px; color:#334155; line-height:1.7;">
    <li>Online applications for TNOU UG, PG, Diploma, and Certificate programs are open for the 2026-27 academic session.</li>
    <li>The tentative closing date for completing online registration and document submission is <strong>20 October 2026*</strong>.</li>
    <li>Generation of an <strong>Academic Bank of Credits (ABC ID)</strong> via DigiLocker is mandatory for all enrolling candidates to track cumulative academic credits.</li>
    <li>Admissions across all regular degree courses (BA, B.Com, B.Sc, BBA, BCA, MA, M.Com, M.Sc, MBA) are conducted on a <strong>merit basis</strong> without entrance examinations.</li>
    <li>Entrance examination is mandatory only for professional teaching programs such as B.Ed. (General) and B.Ed. (Special Education).</li>
    <li><strong>100% Full Tuition Fee Waivers</strong> are provided to differently-abled learners, transgender individuals, and prison inmates in Tamil Nadu central prisons.</li>
    <li>Students pursuing eligible courses in <strong>Tamil medium</strong> are entitled to a statutory <strong>10% concession</strong> on tuition fees.</li>
  </ul>
</div>

<h2>TNOU Distance Education Highlights</h2>
<p>Prospective students can review the summary of institutional features and administrative details for Tamil Nadu Open University below:</p>

<div class="blog-table-responsive">
  <table style="width:100%; border-collapse:collapse; margin:18px 0;">
    <thead>
      <tr style="background:#f1f5f9; text-align:left;">
        <th style="padding:12px 14px; border:1px solid #cbd5e1; width:30%;">Particulars</th>
        <th style="padding:12px 14px; border:1px solid #cbd5e1;">Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;"><strong>University Full Name</strong></td>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;">Tamil Nadu Open University</td>
      </tr>
      <tr>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;"><strong>Acronym / Short Name</strong></td>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;">TNOU</td>
      </tr>
      <tr>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;"><strong>Year of Establishment</strong></td>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;">2002 (Under Tamil Nadu Act No. 27 of 2002)</td>
      </tr>
      <tr>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;"><strong>University Category</strong></td>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;">State Open University (Government of Tamil Nadu)</td>
      </tr>
      <tr>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;"><strong>Accreditations &amp; Recognitions</strong></td>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;">NAAC 'A+' Grade, UGC Section 12-B Status, UGC-DEB, AICTE, NCTE, RCI</td>
      </tr>
      <tr>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;"><strong>Headquarters Location</strong></td>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;">No. 577, Anna Salai, Saidapet, Chennai, Tamil Nadu – 600015</td>
      </tr>
      <tr>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;"><strong>Academic Schools</strong></td>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;">School of Humanities, Social Sciences, Management Studies, Sciences, Education, Continuing Education, Special Education &amp; Rehabilitation</td>
      </tr>
      <tr>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;"><strong>Offered Programs</strong></td>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;">B.A., B.Com., B.Sc., BBA, BCA, B.Lib.I.Sc., M.A., M.Com., M.Sc., MBA, MCA, MSW, Diplomas, PG Diplomas &amp; Certificates</td>
      </tr>
      <tr>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;"><strong>Medium of Instruction</strong></td>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;">English and Tamil (Bilingual study support available)</td>
      </tr>
      <tr>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;"><strong>Admission Cycle</strong></td>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;">Dual Admission Intake: Academic Year (July/August) &amp; Calendar Year (January/February)</td>
      </tr>
      <tr>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;"><strong>Selection Criteria</strong></td>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;">Merit-Based (Marks obtained in qualifying qualifying examinations)</td>
      </tr>
      <tr>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;"><strong>Official Portal</strong></td>
        <td style="padding:10px 14px; border:1px solid #cbd5e1;">www.tnou.ac.in</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>TNOU Distance Education Overview</h2>
<p>Tamil Nadu Open University offers a multi-tier educational pathway designed to cater to diverse educational backgrounds. The university operates under flexible credit transfer regulations aligned with the <strong>National Education Policy (NEP)</strong> and the UGC Open and Distance Learning guidelines. Key structural parameters of TNOU admissions include:</p>

<ul>
  <li><strong>Undergraduate (UG) Eligibility:</strong> Candidates must have passed the Higher Secondary Examination (10+2) conducted by the Government of Tamil Nadu or an equivalent examination recognized by the Association of Indian Universities (AIU). Candidates who have completed a 3-year Polytechnic Diploma following Class 10 are also eligible for direct admission.</li>
  <li><strong>Postgraduate (PG) Eligibility:</strong> Applicants must hold a Bachelor's Degree (under 10+2+3 or 11+1+3 or 11+2+2 pattern) in any relevant stream from a recognized state or central university. Minimum qualifying score requirement is generally 45% to 50% for unreserved categories and 40% to 45% for reserved communities.</li>
  <li><strong>Diploma &amp; Vocational Eligibility:</strong> Standard 1-year diploma programs require a 10th or 12th standard pass, while PG Diplomas require a graduation degree in any discipline.</li>
  <li><strong>Certificate Program Eligibility:</strong> Short-term 6-month certifications require a 10th pass qualification or basic literacy depending on the vocational course.</li>
  <li><strong>Age Bar:</strong> There is <strong>no upper age limit</strong> for enrolling in distance UG, PG, diploma, or certificate programs, promoting lifelong education for learners of all ages.</li>
  <li><strong>Application Fees:</strong> A nominal application processing fee of ₹100 to ₹500 is charged, alongside a one-time registration fee of ₹300 and alumni association fee of ₹500 during initial admission.</li>
</ul>

<h2>About Tamil Nadu Open University (TNOU)</h2>
<p>Established in 2002, Tamil Nadu Open University has emerged as one of India's benchmark open learning institutions. Headquartered on a sprawling campus along Anna Salai in Saidapet, Chennai, TNOU caters to over 1,00,000 active learners spread across urban centers and rural villages throughout Tamil Nadu and adjoining southern states.</p>

<p>The academic governance of TNOU is organized into 13 specialized schools of study, supported by a network of <strong>8 strategically located Regional Centres</strong> in Chennai, Coimbatore, Dharmapuri, Madurai, Tiruchirappalli, Tirunelveli, Villupuram, and The Nilgiris. These regional branches oversee dozens of Learner Support Centres (LSCs), coordinate weekend contact programs, distribute printed Self-Learning Materials (SLMs), and supervise annual term-end examinations.</p>

<p>TNOU is notable for its socially inclusive vision. It was among the pioneer universities in India to offer 100% free higher education to transgender students, prison inmates, and destitute widows, creating genuine socio-economic empowerment through formal educational credentials.</p>

<h2>TNOU Distance Education UG Admission 2026</h2>
<p>Undergraduate degree courses at TNOU are organized over 3 academic years (divided into 6 semesters). The university provides undergraduate programs across humanities, social sciences, business management, commercial accounting, and applied computer applications. All degree curricula are designed in consultation with academic experts and industry practitioners to ensure practical employability.</p>

<div class="blog-table-responsive">
  <table style="width:100%; border-collapse:collapse; margin:16px 0;">
    <thead>
      <tr style="background:#f1f5f9; text-align:left;">
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Course Name</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Duration</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Selection Criteria</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Fee Range (Per Year)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>B.A. Tamil</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Merit-Based (10+2)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹3,500 - ₹4,200/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>B.A. English</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Merit-Based (10+2)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹3,500 - ₹4,500/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>B.A. History</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Merit-Based (10+2)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹3,300 - ₹4,000/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>B.A. Economics</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Merit-Based (10+2)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹3,300 - ₹4,000/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>B.A. Political Science</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Merit-Based (10+2)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹3,300 - ₹4,000/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>B.Com (General)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Merit-Based (10+2 Commerce/Arts)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹4,200 - ₹5,000/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>B.Com (Corporate Secretaryship)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Merit-Based (10+2)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹4,500 - ₹5,500/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>BBA (Business Administration)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Merit-Based (10+2 Any Stream)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹5,500 - ₹6,500/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>B.Sc Mathematics</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Merit-Based (10+2 with Maths)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹4,500 - ₹5,500/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>B.Sc Psychology</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Merit-Based (10+2 Any Stream)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹5,500 - ₹6,800/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>BCA (Computer Applications)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Merit-Based (10+2 with Maths/CS)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹7,500 - ₹9,000/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>B.Lib.I.Sc (Library &amp; Info Science)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">1 Year</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Merit-Based (Graduation)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹5,000 - ₹6,500/year</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>B.Ed. (Special Education)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">2.5 Years</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">University Entrance Exam + Merit</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">₹25,000 - ₹28,000/year</td>
      </tr>
    </tbody>
  </table>
</div>

<h4>TNOU Distance Education UG Course Details</h4>
<p>Each undergraduate course at TNOU is structured to build subject competence and analytical skills:</p>

<ul>
  <li><strong>B.A. Tamil:</strong> Delves into Sangam poetry, epic literature (Silappadikaram, Manimekalai), modern fiction, grammar structures (Nannool, Tholkappiyam), and literary criticism. This course is ideal for candidates preparing for Tamil Nadu Public Service Commission (TNPSC) exams and teaching positions.</li>
  <li><strong>B.A. English:</strong> Covers British literature from Chaucer to the Victorian age, Indian writing in English, post-colonial fiction, phonetics, and professional business communication. Graduates find high-demand roles in content writing, journalism, corporate communications, and digital publishing.</li>
  <li><strong>B.Com (General &amp; Corporate Secretaryship):</strong> Imparts deep foundations in corporate financial accounting, mercantile law, auditing principles, corporate secretarial practice, direct taxation (Income Tax), and GST regulations. It serves as an excellent foundational stepping stone for aspirants aiming for CA, CS, or CMA qualifications.</li>
  <li><strong>BBA (Bachelor of Business Administration):</strong> Develops managerial acumen in principles of management, consumer behavior, human resource management, financial accounting, sales management, and entrepreneurship. The course features practical case studies suitable for young executives.</li>
  <li><strong>BCA (Bachelor of Computer Applications):</strong> Equips learners with essential technical skills in programming languages (C, C++, Core Java), relational database management systems (RDBMS/SQL), data structures, operating systems, web design technologies, and computer networking.</li>
  <li><strong>B.Sc Mathematics &amp; Psychology:</strong> Mathematics students learn calculus, vector analysis, linear algebra, modern algebra, and numerical methods. Psychology students explore foundations of cognitive psychology, social psychology, developmental psychopathology, and counseling fundamentals.</li>
</ul>

<h2>TNOU Distance Education PG Admission 2026</h2>
<p>Postgraduate degree programs at TNOU are conducted over 2 academic years (comprising 4 semesters). Designed for working professionals aiming for senior executive roles, management positions, or academic research, TNOU PG degrees offer exceptional academic rigor at highly affordable fees.</p>

<h2>Tamil Nadu Open University Course Fees Structure</h2>
<p>Below is the detailed program-wise fee schedule outlining Year I Fee, Year II Fee, and Total Cumulative Fee for major postgraduate programs offered by TNOU:</p>

<div class="blog-table-responsive">
  <table style="width:100%; border-collapse:collapse; margin:16px 0;">
    <thead>
      <tr style="background:#f1f5f9; text-align:left;">
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Program</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Year I Fee (₹)</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Year II Fee (₹)</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Total Fee (₹)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>M.B.A (Finance, Operations, Marketing, HR, IT, Logistics)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">13,300</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">12,600</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>25,900</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>M.A. History</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">5,100</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">4,400</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>9,500</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>M.A. Political Science</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">5,100</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">4,400</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>9,500</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>M.A. English</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">5,450</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">4,750</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>10,200</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Master of Social Work (MSW)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">7,300</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">6,600</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>13,900</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>M.A. Criminology &amp; Criminal Justice Administration</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">5,800</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">5,100</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>10,900</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>M.Sc. Psychology</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">7,800</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">7,100</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>14,900</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>M.A. Sociology</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">5,100</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">4,400</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>9,500</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>M.A. Tamil</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">4,650</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3,950</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>8,600</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>M.Com. (General / Corporate Secretaryship)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">5,800</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">5,100</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>10,900</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>M.Sc. Mathematics</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">6,300</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">5,600</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>11,900</strong></td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>MCA (Master of Computer Applications)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">12,000</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">11,000</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>23,000</strong></td>
      </tr>
    </tbody>
  </table>
</div>

<h3>TNOU Distance Education PG Course Details</h3>
<p>Here is an in-depth exploration of major postgraduate degree programs offered by TNOU:</p>

<ul>
  <li><strong>M.B.A (Master of Business Administration):</strong> The TNOU MBA program delivers comprehensive training across executive management competencies. Students can choose dual or single specializations in <em>Financial Management, Marketing Management, Human Resource Management, Operations Management, Logistics &amp; Supply Chain, and Information Technology Systems</em>. The curriculum features corporate case discussions, business simulations, strategic decision-making modules, and a mandatory 4th-semester capstone research project. Total program fee is just ₹25,900 for 2 years.</li>
  <li><strong>M.Com (Master of Commerce):</strong> Focuses on advanced corporate financial accounting, security analysis, international business economics, direct and indirect taxation, financial management, and auditing techniques. Perfect for commerce graduates seeking academic lectureship (via UGC-NET/SET) or accounting leadership in corporate enterprises.</li>
  <li><strong>M.Sc Psychology:</strong> A sought-after clinical and counseling curriculum that includes cognitive neuropsychology, abnormal psychopathology, counseling techniques, psychometric assessment methods, and clinical case analysis. Students complete practical testing workshops and fieldwork to develop counseling competence.</li>
  <li><strong>Master of Social Work (MSW):</strong> Provides specialized theoretical and field exposure in community organization, human resource management &amp; labor welfare, medical &amp; psychiatric social work, and rural development. Students undergo supervised concurrent field visits and block placement training in reputed NGOs and social service organizations.</li>
  <li><strong>M.A. Criminology &amp; Criminal Justice Administration:</strong> A unique multidisciplinary program exploring criminology principles, penology and correctional administration, victimology, juvenile justice systems, forensic science basics, and police administration laws. Highly valued by law enforcement personnel, legal practitioners, and social researchers.</li>
  <li><strong>M.A. English &amp; Tamil:</strong> Provides advanced exploration of literary history, critical theory, post-modernism, comparative literature, and research methodologies. Prepares postgraduates for collegiate teaching, UGC-NET/JRF research fellowships, and editorial careers.</li>
  <li><strong>M.Sc Mathematics:</strong> Explores advanced real analysis, complex variables, topology, functional analysis, fluid dynamics, differential geometry, and numerical algorithms.</li>
</ul>

<h3>TNOU Distance Education Diploma Admission</h3>
<p>TNOU offers several 1-year career-oriented diploma courses tailored for students seeking fast vocational skills and professional certifications. These programs require a 10th or 12th pass qualification, with annual fees ranging between ₹4,000 and ₹8,000:</p>

<ul>
  <li><strong>Diploma in Yoga (DIY):</strong> Trains learners in yogic philosophy, asanas, pranayama, therapeutic meditation, and naturopathic wellness principles.</li>
  <li><strong>Diploma in Early Childhood Care and Education (DECCE):</strong> Prepares aspiring pre-primary teachers, day-care administrators, and child education facilitators in child developmental milestones and nursery pedagogy.</li>
  <li><strong>Diploma in Media Arts &amp; Journalism:</strong> Equips students with foundational skills in electronic reporting, news gathering, copy editing, camera handling, and digital media production.</li>
  <li><strong>Vocational Diplomas:</strong> Practical skill diplomas in Electrical Technology, Refrigeration &amp; Air Conditioning, Fashion Designing, and Health Assistant certifications.</li>
</ul>

<h3>TNOU Distance Education PG Diploma Admission</h3>
<p>For bachelor's degree holders seeking specialized post-graduate credentials, TNOU offers 1-year PG Diploma courses with fee schedules ranging from ₹6,000 to ₹12,000:</p>

<ul>
  <li><strong>PG Diploma in Computer Applications (PGDCA):</strong> Comprehensive training in computer architecture, database management systems (DBMS), Java programming, web design, and operating systems.</li>
  <li><strong>PG Diploma in Human Resource Management (PGDHRM):</strong> Teaches employee recruitment, corporate training &amp; development, labor legalities, industrial relations, and performance appraisals.</li>
  <li><strong>PG Diploma in Psychological Counselling (PGDPC):</strong> Hands-on training in interpersonal counseling, family counseling, child psychology, stress management, and therapeutic intervention.</li>
  <li><strong>PG Diploma in Export &amp; Import Management:</strong> Explores international trade regulations, customs clearance procedures, foreign exchange management, and export documentation.</li>
</ul>

<h3>TNOU Distance Education Certificate Admission</h3>
<p>Short-term 6-month certificate programs are available to learners who have completed 10th standard or equivalent. These courses require minimal tuition fees (₹1,500 to ₹4,000) and provide accelerated certification:</p>

<ul>
  <li><strong>Certificate in Nutrition and Dietetics:</strong> Teaches clinical nutrition basics, balanced dietary planning, maternal and child nutritional care.</li>
  <li><strong>Certificate in Functional English:</strong> Practical training in spoken English, conversational fluency, business correspondence, and workplace etiquette.</li>
  <li><strong>Certificate in Office Automation &amp; DTP:</strong> Hands-on computer application skills including word processing, spreadsheets, presentation software, and page layout design.</li>
</ul>

<h2>TNOU Distance Education Entrance Examination</h2>
<p>Tamil Nadu Open University adopts an inclusive <strong>open admission policy</strong> for the vast majority of its courses. Prospective students can enroll directly based on merit in qualifying board and college examinations without writing an entrance test. However, entrance evaluations are mandatory for specific professional degrees:</p>

<ul>
  <li><strong>B.Ed. (General) and B.Ed. (Special Education):</strong> Admissions are conducted strictly on the basis of a state-level entrance test and merit ranking conforming to NCTE (National Council for Teacher Education) and RCI (Rehabilitation Council of India) guidelines. Candidates must possess an undergraduate degree with at least 50% marks and relevant school teaching experience.</li>
  <li><strong>Research Programs (M.Phil. &amp; Ph.D.):</strong> Candidates seeking enrollment in M.Phil. or Ph.D. research programs must appear for the university's written research aptitude test followed by a personal interview and presentation of their research proposal before the departmental research committee. Candidates with valid UGC-NET, CSIR-NET, or SET scores are exempted from the written test.</li>
</ul>

<h2>Tamil Nadu Open University Admission Process 2026</h2>
<p>Applying for TNOU distance education courses is conducted through a structured online portal. Follow this step-by-step procedure to submit your admission form:</p>

<ol>
  <li><strong>Portal Navigation:</strong> Visit the official Tamil Nadu Open University web portal at <a href="https://www.tnou.ac.in" target="_blank" rel="noopener noreferrer">www.tnou.ac.in</a> and click on the <strong>"Online Admission Portal"</strong> link.</li>
  <li><strong>ABC ID Creation:</strong> Prior to filling out the admission application, navigate to DigiLocker and generate your mandatory 12-digit <strong>Academic Bank of Credits (ABC ID)</strong>. Keep this number handy.</li>
  <li><strong>New User Registration:</strong> Register as a new applicant by entering a valid email ID, active mobile phone number, and creating a secure password. Verify your mobile number using the one-time password (OTP) sent to your device.</li>
  <li><strong>Application Form Completion:</strong> Log into the student admission dashboard and enter your personal details, permanent address, caste category, qualifying academic credentials, and select your preferred course and nearest Regional Study Centre.</li>
  <li><strong>Document Uploading:</strong> Upload scanned digital copies of your passport photograph, signature, marks sheets, and category certificates in JPEG or PDF format (under 500 KB each).</li>
  <li><strong>Fee Remittance:</strong> Pay the application processing fee and prescribed tuition fee through the secure online payment gateway using Net Banking, Debit Card, Credit Card, or UPI.</li>
  <li><strong>Download Enrollment Confirmation:</strong> Upon successful transaction, download and print the completed admission application form and payment receipt. Your official university enrollment number and digital identity card will be generated and dispatched via the student portal.</li>
</ol>

<h3>Required Documents for Admission</h3>
<p>Ensure that self-attested digital copies of the following documents are scanned and prepared prior to initiating registration:</p>

<ul>
  <li>Class 10th / SSLC Marksheet and Board Passing Certificate (proof of date of birth).</li>
  <li>Class 12th / Higher Secondary (+2) Marksheet and Passing Certificate.</li>
  <li>Three-year Polytechnic Diploma Certificate (if applying under diploma lateral route).</li>
  <li>Undergraduate Degree Marksheets (all semesters) and Provisional/Original Degree Certificate (for PG applicants).</li>
  <li>Government-issued Photo Identity Proof (Aadhaar Card, Voter ID, or Passport).</li>
  <li>Recent passport-size colored photographs (taken against a light background).</li>
  <li>Scanned signature of the applicant on clean white paper.</li>
  <li>Community / Caste Certificate issued by competent revenue authority (for BC, MBC, BCM, SC, ST reservation benefits).</li>
  <li>Income Certificate (for candidates applying for state post-matric scholarships).</li>
  <li>Relevant supporting certificate for Differently-Abled (Disability Certificate issued by a Medical Board), Transgender identity card, or Destitute Widow certificate.</li>
  <li>Transfer Certificate (TC) or Migration Certificate from the previous educational institution.</li>
</ul>

<h2>Tamil Nadu Open University Scholarships &amp; Fee Concessions</h2>
<p>Tamil Nadu Open University is recognized as one of the most socially proactive universities in India, offering extensive scholarship schemes and fee exemptions to ensure that financial hardship never acts as a barrier to higher education:</p>

<ul>
  <li><strong>Post-Matric Scholarship for SC/ST Learners:</strong> Eligible candidates belonging to Scheduled Castes (SC), Scheduled Castes Arunthathiyar (SCA), and Scheduled Tribes (ST) whose parental annual income does not exceed ₹2,50,000 can avail reimbursement of tuition fees and book allowances under the Government of Tamil Nadu Post-Matric Scholarship Scheme.</li>
  <li><strong>100% Full Fee Waiver for Transgender Individuals:</strong> TNOU provides completely free education (including full tuition fee exemption and study material waiver) to transgender applicants across all undergraduate, postgraduate, diploma, and certificate programs.</li>
  <li><strong>100% Full Fee Waiver for Differently-Abled Learners:</strong> Students with benchmark disabilities (physically challenged, visually impaired, or hearing impaired with 40% or higher disability) are exempted from 100% of the tuition fee.</li>
  <li><strong>100% Fee Exemption for Prison Inmates:</strong> Under a special rehabilitative partnership with the Tamil Nadu Prison Department, inmates lodged across central prisons in Chennai, Vellore, Madurai, Tiruchirappalli, Coimbatore, and Palayamkottai can pursue any TNOU degree course free of cost.</li>
  <li><strong>10% Tuition Fee Concession for Tamil Medium Learners:</strong> To foster and promote education in the regional language, students who opt to study and write their examinations in the Tamil medium are granted an immediate 10% concession on total tuition fees.</li>
  <li><strong>Concessions for Destitute Widows &amp; Defence Wards:</strong> Fee relief is extended to certified destitute widows and children of ex-servicemen as per state statutory policies.</li>
</ul>

<h2>Tamil Nadu Open University Facilities &amp; Student Support</h2>
<p>TNOU provides distance learners with academic and infrastructural support comparable to conventional universities:</p>

<ul>
  <li><strong>State-of-the-Art Digital Learning Portal (LMS):</strong> TNOU's dedicated e-learning management system provides 24/7 access to downloadable e-books, pre-recorded audio-visual lectures by senior faculty, digital assignments, and interactive webinars.</li>
  <li><strong>Regional Network &amp; Learner Support Centres:</strong> With 8 regional centres and over 50 community colleges across Tamil Nadu, students receive localized academic counseling, administrative guidance, and weekend personal contact sessions close to their hometowns.</li>
  <li><strong>Study Material Production &amp; Distribution:</strong> High-quality, self-instructional study materials (SLMs) authored by prominent university scholars are published and couriered directly to each student's registered residential address. Materials are printed in both Tamil and English.</li>
  <li><strong>TNOU Community Radio 90.4 MHz ("Chennai Rainbow"):</strong> The university operates its own community radio frequency broadcasting educational talks, career advice, expert lectures, and cultural programming tailored for distance students and the community.</li>
  <li><strong>Anna Salai Central Library:</strong> The university's central library houses more than 50,000 printed academic volumes, leading national and international journals, and provides institutional access to UGC-Infonet, INFLIBNET, and digital thesis databases.</li>
  <li><strong>Career Guidance and Placement Assistance Cell:</strong> Assists remote learners with resume-building workshops, corporate soft-skills seminars, and notifications regarding upcoming central, state government, banking, and private corporate recruitment drives.</li>
</ul>

<h2>FAQ's:</h2>
<div style="margin-top:18px;">
  <p><strong>Q: What is the last date to apply for TNOU Distance Education Admission 2026?</strong><br/>
  <strong>A:</strong> The tentative last date for submitting online application forms for Tamil Nadu Open University for the 2026-27 academic session is <strong>20 October 2026*</strong>.</p>

  <p><strong>Q: Are Tamil Nadu Open University degrees valid for UPSC, TNPSC, and government jobs?</strong><br/>
  <strong>A:</strong> Yes, absolutely. TNOU is established under State Act No. 27 of 2002, holds UGC Section 12-B status, and is accredited with a NAAC 'A+' Grade. All TNOU degrees and diplomas are recognized by the UGC-DEB and are 100% valid for TNPSC, UPSC, SSC, Banking, and central/state government recruitment examinations.</p>

  <p><strong>Q: What is the total fee for MBA at TNOU Distance Education?</strong><br/>
  <strong>A:</strong> The total fee for the 2-year MBA program is ₹25,900. Year I fee is ₹13,300 and Year II fee is ₹12,600, making it one of the most affordable accredited MBA programs in India.</p>

  <p><strong>Q: Is an entrance examination required for TNOU general degree courses?</strong><br/>
  <strong>A:</strong> No entrance examination is required for regular BA, B.Com, B.Sc, BBA, BCA, MA, M.Com, M.Sc, or MBA courses. Admission is granted directly on the basis of marks obtained in qualifying examinations. Entrance tests are conducted only for B.Ed. and research (M.Phil/Ph.D.) programs.</p>

  <p><strong>Q: Is creating an ABC ID mandatory for TNOU admission?</strong><br/>
  <strong>A:</strong> Yes, as per UGC guidelines, every student enrolling in higher education must generate an Academic Bank of Credits (ABC ID) via DigiLocker and enter the 12-digit ID in the TNOU online application form.</p>

  <p><strong>Q: How do students receive their TNOU study materials?</strong><br/>
  <strong>A:</strong> Printed Self-Learning Materials (SLMs) in either Tamil or English are dispatched by post/courier directly to the student's registered residential address. Additionally, digital PDF versions are accessible anytime through the TNOU student portal and LMS app.</p>

  <p><strong>Q: Who is eligible for 100% free education at TNOU?</strong><br/>
  <strong>A:</strong> Tamil Nadu Open University provides 100% complete tuition fee exemptions for transgender individuals, differently-abled persons with benchmark disabilities, and jail inmates lodged in Tamil Nadu central prisons.</p>

  <p><strong>Q: Can a student change their selected course or regional study centre after admission?</strong><br/>
  <strong>A:</strong> Yes, a change of program or regional center is permissible within the first academic year prior to the closure of the admission cycle upon submitting a formal request and remitting the prescribed nominal administrative fee (approximately ₹1,000).</p>
</div>
`;

async function updateTNOU() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas');

  const updatedBlog = await Blog.findOneAndUpdate(
    { slug: 'tnou-distance-education' },
    {
      $set: {
        content: TNOU_EXPANDED_CONTENT,
        metaTitle: 'TNOU Distance Education Admission 2026 | Fees, Courses & Last Date',
        metaDescription: 'Complete guide to Tamil Nadu Open University (TNOU) Distance Education Admission 2026. Explore BA, B.Com, MBA, M.Com, M.Sc, B.Ed fee structure, eligibility, courses & process.',
        excerpt: 'Tamil Nadu Open University (TNOU) distance education admissions for 2026 are active. Review comprehensive undergraduate and postgraduate course details, program-wise fee structures, scholarship concessions, eligibility guidelines, and application steps.',
        updatedDate: new Date()
      }
    },
    { new: true }
  );

  if (updatedBlog) {
    console.log('Successfully updated TNOU blog in MongoDB!');
    console.log('New Content Length:', updatedBlog.content.length);
    console.log('Status:', updatedBlog.status);
    console.log('Published:', updatedBlog.published);
  } else {
    console.error('TNOU blog not found with slug tnou-distance-education');
  }

  process.exit(0);
}

updateTNOU().catch(err => {
  console.error(err);
  process.exit(1);
});
