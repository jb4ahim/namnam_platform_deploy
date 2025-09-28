import { Injectable } from '@nestjs/common';
import { NotificationTemplate } from '../dto/notification.dto';
import * as handlebars from 'handlebars';

interface Template {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class TemplateService {
  private templates: Map<NotificationTemplate, Template> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates() {
    // Load templates - in production, load from files or database
    this.templates.set(NotificationTemplate.WELCOME, {
      subject: 'Welcome to {{appName}}!',
      html: '<h1>Welcome {{userName}}!</h1><p>Thank you for joining {{appName}}.</p>',
      text: 'Welcome {{userName}}! Thank you for joining {{appName}}.'
    });

    this.templates.set(NotificationTemplate.PASSWORD_RESET, {
      subject: 'Reset your password',
      html: '<h1>Password Reset</h1><p>Click <a href="{{resetUrl}}">here</a> to reset your password.</p>',
      text: 'Password Reset: Click here to reset your password: {{resetUrl}}'
    });
  }

  renderTemplate(template: NotificationTemplate, data: Record<string, any>): Template {
    const tmpl = this.templates.get(template);
    if (!tmpl) {
      throw new Error(`Template ${template} not found`);
    }

    return {
      subject: handlebars.compile(tmpl.subject)(data),
      html: handlebars.compile(tmpl.html)(data),
      text: handlebars.compile(tmpl.text)(data)
    };
  }

  addTemplate(template: NotificationTemplate, tmpl: Template) {
    this.templates.set(template, tmpl);
  }
}
