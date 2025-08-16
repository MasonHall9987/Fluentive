"use client";
import { Settings, User, Globe, Volume2, Bell, Shield, HelpCircle } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16 animate-fade-in">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </a>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
        </div>

        {/* Settings Categories */}
        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindaro)] to-[var(--emerald)] rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
                <p className="text-gray-300 text-sm">Manage your account information and preferences</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">Display Name</h4>
                  <p className="text-gray-400 text-sm">Your name as it appears in the app</p>
                </div>
                <button className="px-4 py-2 text-[var(--mindaro)] hover:text-[var(--emerald)] transition-colors">
                  Edit
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">Email</h4>
                  <p className="text-gray-400 text-sm">user@example.com</p>
                </div>
                <button className="px-4 py-2 text-[var(--mindaro)] hover:text-[var(--emerald)] transition-colors">
                  Change
                </button>
              </div>
            </div>
          </div>

          {/* Language & Learning Settings */}
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--bondi-blue)] to-[var(--lapis-lazuli)] rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Language & Learning</h3>
                <p className="text-gray-300 text-sm">Customize your learning experience</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">Native Language</h4>
                  <p className="text-gray-400 text-sm">English</p>
                </div>
                <button className="px-4 py-2 text-[var(--bondi-blue)] hover:text-[var(--lapis-lazuli)] transition-colors">
                  Change
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">Target Language</h4>
                  <p className="text-gray-400 text-sm">Spanish</p>
                </div>
                <button className="px-4 py-2 text-[var(--bondi-blue)] hover:text-[var(--lapis-lazuli)] transition-colors">
                  Change
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">Learning Level</h4>
                  <p className="text-gray-400 text-sm">Intermediate (B1)</p>
                </div>
                <button className="px-4 py-2 text-[var(--bondi-blue)] hover:text-[var(--lapis-lazuli)] transition-colors">
                  Adjust
                </button>
              </div>
            </div>
          </div>

          {/* Audio & Speech Settings */}
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--verdigris)] to-[var(--keppel)] rounded-xl flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Audio & Speech</h3>
                <p className="text-gray-300 text-sm">Configure audio playback and speech recognition</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">Default Playback Speed</h4>
                  <p className="text-gray-400 text-sm">Normal (1.0x)</p>
                </div>
                <button className="px-4 py-2 text-[var(--verdigris)] hover:text-[var(--keppel)] transition-colors">
                  Adjust
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">Speech Recognition Sensitivity</h4>
                  <p className="text-gray-400 text-sm">Medium</p>
                </div>
                <button className="px-4 py-2 text-[var(--verdigris)] hover:text-[var(--keppel)] transition-colors">
                  Adjust
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--indigo-dye)] to-[var(--cerulean)] rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Notifications</h3>
                <p className="text-gray-300 text-sm">Manage your notification preferences</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">Daily Reminders</h4>
                  <p className="text-gray-400 text-sm">Get reminded to practice daily</p>
                </div>
                <div className="w-12 h-6 bg-[var(--indigo-dye)] rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">Progress Updates</h4>
                  <p className="text-gray-400 text-sm">Weekly progress summaries</p>
                </div>
                <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-transform"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Privacy & Security</h3>
                <p className="text-gray-300 text-sm">Manage your data and security settings</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">Data Collection</h4>
                  <p className="text-gray-400 text-sm">Control what data is collected</p>
                </div>
                <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                  Configure
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">Export Data</h4>
                  <p className="text-gray-400 text-sm">Download your learning data</p>
                </div>
                <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindaro)] to-[var(--light-green)] rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Help & Support</h3>
                <p className="text-gray-300 text-sm">Get help and contact support</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">Documentation</h4>
                  <p className="text-gray-400 text-sm">User guides and tutorials</p>
                </div>
                <button className="px-4 py-2 text-[var(--mindaro)] hover:text-[var(--light-green)] transition-colors">
                  View
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h4 className="text-white font-medium">Contact Support</h4>
                  <p className="text-gray-400 text-sm">Get help from our team</p>
                </div>
                <button className="px-4 py-2 text-[var(--mindaro)] hover:text-[var(--light-green)] transition-colors">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            Fluentive v1.0.0 • Made with ❤️ for language learners
          </p>
        </div>
      </div>
    </div>
  );
}
