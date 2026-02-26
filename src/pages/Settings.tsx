import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pencil, 
  Sun, 
  Moon, 
  Trash2,
  User,
  CreditCard,
  Coins,
  X,
  Camera,
  Check
} from 'lucide-react';
import Layout from '../components/Layout';

const Settings = () => {
  const [publishToExplore, setPublishToExplore] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '214e9af1ec4',
    email: 'k.mantu9004@gmail.com',
    image: null as string | null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditModal(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0a0a] relative">
        {/* Dot Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {profileData.image ? (
                  <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profileData.username.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{profileData.username}</h2>
                <p className="text-gray-500 text-sm">{profileData.email}</p>
              </div>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-sm font-bold text-white group"
            >
              <Pencil className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              Edit profile
            </button>
          </motion.div>

          {/* Account Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 pb-4">
              <h3 className="text-white font-bold text-lg">Account details</h3>
              <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                <CreditCard className="w-4 h-4" />
                Manage plan & credits
              </button>
            </div>

            <div className="px-6 pb-6 space-y-0">
              <div className="py-4">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Username</span>
                <p className="text-white font-bold mt-1">{profileData.username}</p>
              </div>
              <div className="border-t border-white/[0.06]" />

              <div className="py-4">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Email</span>
                <p className="text-white font-bold mt-1">{profileData.email}</p>
              </div>
              <div className="border-t border-white/[0.06]" />

              <div className="py-4">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Plan</span>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-white font-bold">Free Plan</span>
                  </div>
                  <button className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors">
                    Why go PRO?
                  </button>
                </div>
              </div>
              <div className="border-t border-white/[0.06]" />

              <div className="py-4">
                <span className="text-gray-500 text-xs uppercase tracking-wider">Credits</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Coins className="w-3 h-3 text-yellow-500" />
                  </div>
                  <span className="text-white font-bold">1</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden"
          >
            <h3 className="text-white font-bold text-lg p-6 pb-2">Settings</h3>
            <div className="border-t border-white/[0.06] mx-6" />
            <div className="p-6 pt-4 space-y-0">
              <div className="flex items-center justify-between py-4">
                <div className="flex-1 pr-4">
                  <h4 className="text-white font-bold text-sm">Publish to explore</h4>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    All your generations will be automatically published to the Explore page. Only premium users can disable this setting.
                  </p>
                </div>
                <button
                  onClick={() => setPublishToExplore(!publishToExplore)}
                  className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${publishToExplore ? 'bg-purple-500' : 'bg-white/10'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-lg ${publishToExplore ? 'left-[26px]' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="border-t border-white/[0.06]" />

              <div className="flex items-center justify-between py-4">
                <div>
                  <h4 className="text-white font-bold text-sm">Theme</h4>
                  <p className="text-gray-500 text-xs mt-1">{theme === 'dark' ? 'Dark' : 'Light'}</p>
                </div>
                <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'light' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delete Account Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.03] border border-red-500/10 rounded-2xl p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-white font-bold text-lg">Delete Account</h3>
              <p className="text-gray-500 text-sm mt-1">This will permanently delete your account</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold transition-all">
              <Trash2 className="w-4 h-4" />
              Delete account
            </button>
          </motion.div>
        </div>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {showEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                onClick={() => setShowEditModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.form
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onSubmit={handleSaveProfile}
                className="relative bg-[#111] border border-white/[0.06] rounded-3xl p-8 w-full max-w-md"
              >
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-white text-2xl font-bold mb-8">Edit Profile</h2>

                <div className="space-y-6">
                  {/* Image Upload */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                        {profileData.image ? (
                          <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-purple-400 uppercase tracking-widest hover:underline"
                    >
                      Change Photo
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-500 text-xs uppercase tracking-wider block mb-2">Username</label>
                      <input
                        value={profileData.username}
                        onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-purple-500/50 transition-all font-bold"
                        placeholder="Enter username"
                      />
                    </div>

                    <div>
                      <label className="text-gray-500 text-xs uppercase tracking-wider block mb-2">Email Address</label>
                      <input
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-purple-500/50 transition-all font-bold"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 py-4 rounded-2xl border border-white/10 font-bold text-gray-400 hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 font-bold text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Settings;
