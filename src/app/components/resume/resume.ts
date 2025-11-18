import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface WorkExperience {
  id: number;
  title: string;
  company: string;
  period: string;
  achievements: string[];
}

interface SkillCategory {
  name: string;
  skills: string[];
}

interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  highlights: string[];
}

interface Certification {
  id: number;
  name: string;
  year: string;
  tagClass: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string[];
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  linkedinUrl: string;
  github: string;
  githubUrl: string;
}

@Component({
  selector: 'app-resume',
  imports: [RouterLink, CommonModule],
  templateUrl: './resume.html',
  styleUrl: './resume.css',
})
export class ResumeComponent {
  personalInfo: PersonalInfo = {
    name: 'Bechir Braham',
    email: 'bechir.braham@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/bechir-braham',
    linkedinUrl: 'https://linkedin.com/in/bechir-braham',
    github: 'github.com/Bechir-Braham',
    githubUrl: 'https://github.com/Bechir-Braham'
  };

  professionalSummary = `Passionate software developer with 5+ years of experience in full-stack web development, 
    mobile applications, and cloud technologies. Proven track record of delivering scalable 
    solutions using modern technologies like JavaScript, Python, React, and Node.js. Strong 
    problem-solving skills with a focus on clean, maintainable code and user experience.`;

  workExperience: WorkExperience[] = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      company: 'Tech Innovations Inc.',
      period: 'January 2022 - Present',
      achievements: [
        'Led development of a microservices architecture serving 100K+ daily users',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Mentored junior developers and conducted code reviews',
        'Built responsive web applications using React, TypeScript, and Node.js',
        'Optimized database queries improving application performance by 40%'
      ]
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      period: 'June 2020 - December 2021',
      achievements: [
        'Developed and maintained web applications using Django and React',
        'Integrated third-party APIs and payment processing systems',
        'Collaborated with design team to implement pixel-perfect UI/UX',
        'Participated in agile development process and sprint planning',
        'Wrote comprehensive unit and integration tests'
      ]
    },
    {
      id: 3,
      title: 'Junior Software Developer',
      company: 'Digital Solutions Ltd.',
      period: 'August 2019 - May 2020',
      achievements: [
        'Built mobile applications using React Native for iOS and Android',
        'Developed RESTful APIs using Python Flask',
        'Maintained legacy systems and implemented bug fixes',
        'Participated in daily standups and sprint retrospectives'
      ]
    }
  ];

  skillCategories: SkillCategory[] = [
    {
      name: 'Languages',
      skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'HTML5', 'CSS3', 'SQL']
    },
    {
      name: 'Frontend',
      skills: ['React', 'Vue.js', 'Angular', 'Tailwind CSS', 'Bootstrap', 'Sass', 'Webpack']
    },
    {
      name: 'Backend',
      skills: ['Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'RESTful APIs']
    },
    {
      name: 'Databases',
      skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch']
    },
    {
      name: 'DevOps & Tools',
      skills: ['Docker', 'AWS', 'Git', 'Jenkins', 'CI/CD', 'Linux', 'Nginx']
    },
    {
      name: 'Mobile',
      skills: ['React Native', 'Flutter', 'iOS Development', 'Android Development']
    }
  ];

  education: Education[] = [
    {
      id: 1,
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Technology',
      period: 'September 2015 - June 2019',
      highlights: [
        'Graduated Magna Cum Laude with GPA 3.8/4.0',
        'Relevant coursework: Data Structures, Algorithms, Software Engineering',
        'Capstone project: Machine Learning-based Recommendation System'
      ]
    }
  ];

  certifications: Certification[] = [
    {
      id: 1,
      name: 'AWS Certified Solutions Architect',
      year: '2023',
      tagClass: 'tag--success'
    },
    {
      id: 2,
      name: 'React Developer Certification',
      year: '2022',
      tagClass: 'tag--success'
    },
    {
      id: 3,
      name: 'Scrum Master Certification',
      year: '2021',
      tagClass: 'tag--success'
    },
    {
      id: 4,
      name: 'Employee of the Year - Tech Innovations Inc.',
      year: '2023',
      tagClass: 'tag--warning'
    },
    {
      id: 5,
      name: 'Open Source Contributor - 50+ GitHub contributions',
      year: 'Ongoing',
      tagClass: 'tag--secondary'
    }
  ];

  notableProjects: Project[] = [
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with React frontend, Node.js backend, and MongoDB database. Features include user authentication, payment integration, inventory management, and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API']
    },
    {
      id: 2,
      name: 'Task Management App',
      description: 'Cross-platform mobile application built with React Native. Includes real-time synchronization, push notifications, and collaborative features.',
      technologies: ['React Native', 'TypeScript', 'Firebase', 'Redux']
    }
  ];

  downloadResume(): void {
    // Create notification for demo purposes
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-success text-black p-4 rounded shadow-lg z-50';
    notification.innerHTML = `
      <strong>Download Started!</strong><br>
      <small>PDF generation would happen here in a real implementation.</small>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  get leftSkillCategories(): SkillCategory[] {
    const midpoint = Math.ceil(this.skillCategories.length / 2);
    return this.skillCategories.slice(0, midpoint);
  }

  get rightSkillCategories(): SkillCategory[] {
    const midpoint = Math.ceil(this.skillCategories.length / 2);
    return this.skillCategories.slice(midpoint);
  }
}
