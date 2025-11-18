import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ProjectStat {
  label: string;
  value: string;
}

interface ProjectLink {
  label: string;
  url: string;
  icon: string;
  primary: boolean;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  statusText: string;
  featured: boolean;
  categories: string[];
  technologies: string[];
  stats: ProjectStat[];
  links: ProjectLink[];
}

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-projects',
  imports: [RouterLink, CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsComponent {
  selectedCategory = 'all';
  
  categories: Category[] = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Apps' },
    { id: 'mobile', name: 'Mobile Apps' },
    { id: 'api', name: 'APIs' },
    { id: 'tools', name: 'Tools' }
  ];

  allProjects: Project[] = [
    {
      id: 1,
      name: 'Personal Terminal Website',
      description: 'An interactive terminal-style personal website built with vanilla HTML, CSS, and JavaScript. Features command-line interface, keyboard navigation, command history, and tab completion. Showcases creative UI/UX design with retro computing aesthetics.',
      status: 'live',
      statusText: 'Live',
      featured: true,
      categories: ['web', 'tools'],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
      stats: [
        { label: 'Lines', value: '~800' },
        { label: 'Type', value: 'Portfolio' },
        { label: 'Year', value: '2025' }
      ],
      links: [
        { label: 'GitHub', url: 'https://github.com/Bechir-Braham', icon: '🐙', primary: true },
        { label: 'Live Demo', url: '/', icon: '🔗', primary: false }
      ]
    },
    {
      id: 2,
      name: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with modern React frontend and Node.js backend. Features user authentication, product catalog, shopping cart, payment integration with Stripe, order management, and admin dashboard with analytics.',
      status: 'live',
      statusText: 'Live',
      featured: false,
      categories: ['web'],
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'AWS'],
      stats: [
        { label: 'Users', value: '5K+' },
        { label: 'Orders', value: '1.2K+' },
        { label: 'Uptime', value: '99.9%' }
      ],
      links: [
        { label: 'GitHub', url: '#', icon: '🐙', primary: true },
        { label: 'Live Demo', url: '#', icon: '🔗', primary: false }
      ]
    },
    {
      id: 3,
      name: 'Task Manager App',
      description: 'Cross-platform mobile application built with React Native for task and project management. Features real-time synchronization, push notifications, collaborative workspaces, offline support, and intuitive gesture-based interactions.',
      status: 'live',
      statusText: 'Live',
      featured: false,
      categories: ['mobile'],
      technologies: ['React Native', 'TypeScript', 'Firebase', 'Redux', 'Push Notifications'],
      stats: [
        { label: 'Downloads', value: '2.5K+' },
        { label: 'Rating', value: '4.7★' },
        { label: 'Tasks Created', value: '50K+' }
      ],
      links: [
        { label: 'GitHub', url: '#', icon: '🐙', primary: true },
        { label: 'App Store', url: '#', icon: '📱', primary: false },
        { label: 'Play Store', url: '#', icon: '🤖', primary: false }
      ]
    },
    {
      id: 4,
      name: 'Weather Dashboard',
      description: 'Real-time weather data visualization dashboard with interactive charts and maps. Features location-based weather, 7-day forecasts, weather alerts, historical data analysis, and responsive design optimized for both desktop and mobile.',
      status: 'live',
      statusText: 'Live',
      featured: false,
      categories: ['web'],
      technologies: ['Vue.js', 'D3.js', 'OpenWeather API', 'Chart.js', 'Tailwind CSS'],
      stats: [
        { label: 'API Calls', value: '100K+/month' },
        { label: 'Locations', value: '500+' },
        { label: 'Accuracy', value: '95%' }
      ],
      links: [
        { label: 'GitHub', url: '#', icon: '🐙', primary: true },
        { label: 'Live Demo', url: '#', icon: '🔗', primary: false }
      ]
    },
    {
      id: 5,
      name: 'API Gateway Service',
      description: 'Microservices API gateway built with Node.js and Express. Handles authentication, rate limiting, load balancing, request/response transformation, monitoring, and logging. Supports multiple authentication methods and provides comprehensive analytics.',
      status: 'live',
      statusText: 'Live',
      featured: false,
      categories: ['api'],
      technologies: ['Node.js', 'Express.js', 'Redis', 'Docker', 'Kubernetes', 'JWT'],
      stats: [
        { label: 'Requests', value: '1M+/day' },
        { label: 'Services', value: '25+' },
        { label: 'Latency', value: '<50ms' }
      ],
      links: [
        { label: 'GitHub', url: '#', icon: '🐙', primary: true },
        { label: 'Documentation', url: '#', icon: '📚', primary: false }
      ]
    },
    {
      id: 6,
      name: 'DevOps Automation Suite',
      description: 'Collection of automation tools and scripts for DevOps workflows. Includes CI/CD pipeline templates, infrastructure as code configurations, monitoring dashboards, and deployment automation scripts for various cloud providers.',
      status: 'live',
      statusText: 'Live',
      featured: false,
      categories: ['tools'],
      technologies: ['Python', 'Bash', 'Docker', 'Terraform', 'Jenkins', 'AWS CLI'],
      stats: [
        { label: 'Scripts', value: '50+' },
        { label: 'Deployments', value: '500+' },
        { label: 'Time Saved', value: '80%' }
      ],
      links: [
        { label: 'GitHub', url: '#', icon: '🐙', primary: true },
        { label: 'Documentation', url: '#', icon: '📚', primary: false }
      ]
    }
  ];

  filteredProjects: Project[] = [...this.allProjects];

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterProjects();
  }

  filterProjects(): void {
    if (this.selectedCategory === 'all') {
      this.filteredProjects = [...this.allProjects];
    } else {
      this.filteredProjects = this.allProjects.filter(project => 
        project.categories.includes(this.selectedCategory)
      );
    }
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.filteredProjects = [...this.allProjects];
  }

  openProjectLink(url: string, label: string): void {
    if (url === '#') {
      // Show demo notification for placeholder links
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-info text-black p-4 rounded shadow-lg z-50';
      notification.innerHTML = `
        <strong>Project Link</strong><br>
        <small>${label} would open here in a real implementation</small>
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}
