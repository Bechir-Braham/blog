import { Routes } from '@angular/router';
import { TerminalComponent } from './components/terminal/terminal';
import { ContactComponent } from './components/contact/contact';
import { ResumeComponent } from './components/resume/resume';
import { BlogComponent } from './components/blog/blog';
import { ProjectsComponent } from './components/projects/projects';

export const routes: Routes = [
  { path: '', component: TerminalComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'resume', component: ResumeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: '**', redirectTo: '' }
];
