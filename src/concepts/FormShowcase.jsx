import { useState } from 'react';

function FieldError({ msg }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

export default function FormShowcase() {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    interests: [],
    plan: 'basic',
    bio: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate(name, value) {
    if (name === 'name' && !value.trim()) return 'Name is required';
    if (name === 'email') {
      if (!value.trim()) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email address';
    }
    if (name === 'password' && value && value.length < 6) return 'Password must be at least 6 characters';
    return '';
  }

  function handleChange(name, value) {
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function handleBlur(name) {
    const err = validate(name, fields[name]);
    if (err) setErrors((prev) => ({ ...prev, [name]: err }));
  }

  function toggleInterest(interest) {
    setFields((prev) => {
      const list = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: list };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    ['name', 'email'].forEach((f) => {
      const err = validate(f, fields[f]);
      if (err) newErrors[f] = err;
    });
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-3">
        <div className="text-4xl">✅</div>
        <h3 className="text-lg font-bold text-emerald-800">Form Submitted!</h3>
        <div className="text-sm text-emerald-700 space-y-1 text-left inline-block">
          <p><strong>Name:</strong> {fields.name}</p>
          <p><strong>Email:</strong> {fields.email}</p>
          <p><strong>Role:</strong> {fields.role || 'Not selected'}</p>
          <p><strong>Plan:</strong> {fields.plan}</p>
          {fields.interests.length > 0 && (
            <p><strong>Interests:</strong> {fields.interests.join(', ')}</p>
          )}
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setFields({ name: '', email: '', password: '', role: '', interests: [], plan: 'basic', bio: '' });
            setErrors({});
          }}
          className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Reset Form
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      {/* Text Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={fields.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder="Jane Doe"
          className={`w-full border rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
            errors.name
              ? 'border-red-400 focus:ring-red-400 bg-red-50'
              : 'border-slate-200 focus:ring-indigo-500 focus:border-transparent'
          }`}
        />
        <FieldError msg={errors.name} />
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={fields.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="jane@example.com"
          className={`w-full border rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
            errors.email
              ? 'border-red-400 focus:ring-red-400 bg-red-50'
              : 'border-slate-200 focus:ring-indigo-500 focus:border-transparent'
          }`}
        />
        <FieldError msg={errors.email} />
      </div>

      {/* Password with toggle */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={fields.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            placeholder="••••••••"
            className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
              errors.password
                ? 'border-red-400 focus:ring-red-400 bg-red-50'
                : 'border-slate-200 focus:ring-indigo-500 focus:border-transparent'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <FieldError msg={errors.password} />
      </div>

      {/* Select Dropdown */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
        <select
          value={fields.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition"
        >
          <option value="">Select a role...</option>
          <option value="designer">UI/UX Designer</option>
          <option value="developer">Frontend Developer</option>
          <option value="fullstack">Fullstack Developer</option>
          <option value="manager">Product Manager</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Checkbox Group */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Interests</label>
        <div className="space-y-2">
          {['Design Systems', 'Accessibility', 'Performance', 'Animations', 'Dark Mode'].map((interest) => (
            <label key={interest} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={fields.interests.includes(interest)}
                onChange={() => toggleInterest(interest)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 group-hover:text-indigo-600 transition-colors">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Radio Group */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Plan</label>
        <div className="space-y-2">
          {[
            { value: 'free', label: 'Free', desc: 'Basic features' },
            { value: 'basic', label: 'Basic', desc: '$9/month' },
            { value: 'pro', label: 'Pro', desc: '$29/month' },
          ].map(({ value, label, desc }) => (
            <label
              key={value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                fields.plan === value
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="plan"
                value={value}
                checked={fields.plan === value}
                onChange={() => handleChange('plan', value)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <span className="text-xs text-slate-400 ml-2">{desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio</label>
        <textarea
          value={fields.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          rows={3}
          placeholder="Tell us about yourself..."
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
        />
        <p className="text-xs text-slate-400 mt-1">{fields.bio.length}/200 characters</p>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 active:scale-95 transition-all duration-150 shadow-sm"
      >
        Submit Form
      </button>
    </form>
  );
}
