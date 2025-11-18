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
  institution: string;
  year: string;
  tagClass: string;
}

interface Publication {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: string;
  type: string;
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
    email: 'bechir.braham@outlook.com',
    phone: '(+49) 15510031681',
    location: 'Munich, Germany',
    linkedin: 'bechir--braham',
    linkedinUrl: 'https://fr.linkedin.com/in/bechir-brahem2000',
    github: 'Bechir-Braham',
    githubUrl: 'https://github.com/Bechir-Braham'
  };

  professionalSummary = `Software Engineer specializing in scalable DevOps pipelines, distributed systems, and machine learning infrastructure.`;

  languages = `Arabic: Native, English: Proficient (C1), French: Good (B2), German: Basic (B1) and enrolled in a B2 course.`;

  workExperience: WorkExperience[] = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Fernride - Build Automation and Tooling Team',
      period: 'November 2024 - Present',
      achievements: [
        'Managed and maintained a Bazel-based build system for autonomous and teleoperated terminal trucks, supporting a multi-language monorepo.',
        'Operated and contributed to CI (Continuous Integration) infrastructure across on-premises, AWS and Azure cloud environments; Utilized Terraform for infrastructure as code, integrated microservices with Kubernetes, and implemented robust monitoring, alerting, and SLOs (Service Level Objectives).',
        'Designed and led the implementation of a static analysis gating solution to enforce safety certification requirements (TÜV), reducing static analysis violations from ~10,000 to ~200 in six months.',
        'Designed a hibernation based solution for CI cloud machines to preserve the Bazel server cache, potentially resulting in over 90% performance improvement for cold job runs and approximately 60% reduction in compute costs.',
        'Integrated recorded real-world vehicle-simulation tests into CI as a safety-quality gate, sped up runtime using multi-level caching (shared Lustre Filesystem + Bazel remote cache), and added the checks to PR and merge pipelines to speed impact analysis for certified releases.'
      ]
    },
    {
      id: 2,
      title: 'Software Engineering Intern',
      company: 'Paul Scherrer Institut - Detectors Group',
      period: 'February - July 2024',
      achievements: [
        'Architected and implemented a data analysis library for hybrid pixel X-ray detectors using C++. The library is able to read and write data from different file formats, send and receive data from multiple servers, synchronize between data-streams and analyze data using different optimized algorithms.',
        'Developed Python bindings with pybind11 to expose C++ internals, enabling users to write readable and easy to use Python code while benefiting from C++ performance.',
        'Provided an easy to use parallelization framework for scientists to run their algorithms. Users are able to run algorithms on: multiple threads, multiple processes and multiple distributed nodes communicating via ZeroMQ.',
        'Improved the parallelization of Python threads (4x improvement) by releasing and acquiring the Global Interpreter Lock (GIL) carefully in the Python bindings.'
      ]
    },
    {
      id: 3,
      title: 'Software Engineering Intern',
      company: 'Paul Scherrer Institut - Detectors Group',
      period: 'August - October 2023',
      achievements: [
        'Contributed to the development of an open-source GUI application for testing and configuring hybrid X-ray detectors. The interface was developed using Python and PyQt and it binds to C++ code for faster backend communication with the detector server.',
        'Implemented unit, integration, and end-to-end testing, reaching test coverage of over 80% for the GUI application.',
        'Automated C++ code generation for the SLS detector package\'s command-line interface using Python, reducing code complexity and significantly improving maintainability and flexibility.'
      ]
    },
    {
      id: 4,
      title: 'DevOps & Backend Engineer (Working Student)',
      company: 'Upkurs',
      period: 'September 2022 - January 2023',
      achievements: [
        'Established CI/CD (Continuous Integration and Deployment) pipelines for both development and production environments on Google Cloud (GCP); managed deployments for Cloud Storage, MongoDB databases, and mail services.',
        'Implemented a NestJS service that communicates with Google Calendar API using OAuth 2.0 to generate Google Meet links and return them to clients over WebSockets.',
        'Improved backend servers\' response times for Authentication and User services by up to 70% through asynchronous programming and algorithmic optimizations.'
      ]
    },
    {
      id: 5,
      title: 'Machine Learning R&D Intern',
      company: 'Laboratory of Images, Signals and Intelligent Systems, University Paris-Est Créteil',
      period: 'June - September 2022',
      achievements: [
        'Performed comprehensive literature reviews and critically evaluated machine learning methodologies for PTSD recognition using EEG (electroencephalogram) data.',
        'Co-authored review paper, contributing analytical insights and actionable recommendations for advancing EEG-based PTSD detection approaches.'
      ]
    },
    {
      id: 6,
      title: 'Deep Learning & Computer Vision Engineer Intern',
      company: 'EZZAYRA',
      period: 'April - May 2022',
      achievements: [
        'Managed a team of 4 interns to design, test and deploy a deep learning model on an agricultural autonomous robot to locate and classify ripe and unripe strawberries.',
        'Achieved an mAP (mean average precision) of 0.82 using a YOLO based model and deployed the model with web interface as a prototype.'
      ]
    }
  ];

  skillCategories: SkillCategory[] = [
    {
      name: 'Programming Languages',
      skills: ['Python', 'C++', 'JavaScript', 'Go', 'Java']
    },
    {
      name: 'DevOps',
      skills: ['CI/CD', 'Bazel', 'GitHub Actions', 'Docker', 'Kubernetes', 'Ansible', 'Terraform', 'Git', 'Linux']
    },
    {
      name: 'Cloud Computing',
      skills: ['AWS', 'Azure', 'GCP']
    },
    {
      name: 'Machine Learning/AI',
      skills: ['PyTorch', 'TensorFlow', 'Ray']
    }
  ];

  education: Education[] = [
    {
      id: 1,
      degree: 'Software Engineering Diploma (Equivalent to Master of Science)',
      institution: 'National Institute of Applied Science and Technology (INSAT), University of Carthage',
      period: 'September 2019 - October 2024',
      highlights: [
        'Located in Tunisia',
        'Comprehensive software engineering curriculum',
        'Master\'s level education with focus on practical applications'
      ]
    }
  ];

  publications: Publication[] = [
    {
      id: 1,
      title: 'Machine Learning-based Approaches for Post-Traumatic Stress Disorder Diagnosis using Video and EEG Sensors: A Review',
      authors: 'Alice Othmani, Bechir Brahem, Younes Haddou and Mustaqueem Khan',
      journal: 'IEEE Sensors Journal, 2023 (Q1, Impact factor: 4.3)',
      year: '2023',
      type: 'journal'
    },
    {
      id: 2,
      title: 'iCompass at WANLP 2022 Shared Task: ARBERT and MARBERT for Multilabel Propaganda Classification of Arabic Tweets',
      authors: 'Taboubi Bilel, Bechir Brahem, and Hatem Haddad',
      journal: 'Empirical Methods in Natural Language Processing (EMNLP) Workshops 2022 (Class A*)',
      year: '2022',
      type: 'conference'
    }
  ];

  certifications: Certification[] = [
    {
      id: 1,
      name: 'Fundamentals of Accelerated Computing with CUDA C/C++',
      institution: 'NVIDIA Deep Learning Institute (DLI)',
      year: 'March 2023',
      tagClass: 'tag--success'
    },
    {
      id: 2,
      name: 'Fundamentals of Accelerated Computing with CUDA Python',
      institution: 'NVIDIA Deep Learning Institute (DLI)',
      year: 'July 2022',
      tagClass: 'tag--success'
    },
    {
      id: 3,
      name: 'Building Intelligent Recommender Systems',
      institution: 'NVIDIA Deep Learning Institute (DLI)',
      year: 'June 2022',
      tagClass: 'tag--success'
    },
    {
      id: 4,
      name: 'Fundamentals of Deep Learning',
      institution: 'NVIDIA Deep Learning Institute (DLI)',
      year: 'May 2022',
      tagClass: 'tag--success'
    },
    {
      id: 5,
      name: 'TensorFlow: Advanced Techniques',
      institution: 'Coursera',
      year: 'March 2022',
      tagClass: 'tag--success'
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
