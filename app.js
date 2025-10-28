const { useState, useEffect } = React;
const { Plus, Heart, Clock, BookOpen, Star, Sun, Moon, Coffee, Briefcase, Users, Music, Target, Share2, CheckCircle2 } = lucide;

const StatCard = ({ title, value, icon: Icon, color, subtitle, score }) => {
  const colorClasses = {
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    teal: 'bg-teal-50 text-teal-600 border-teal-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]} bg-opacity-50 relative`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-xl font-bold ${colorClasses[color].split(' ')[1]}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <Icon className={`w-8 h-8 ${colorClasses[color].split(' ')[1]}`} />
      </div>
      {score !== undefined && (
        <div className={`absolute top-2 right-10 text-sm font-bold ${getScoreColor(score)}`}>
          {score}%
        </div>
      )}
    </div>
  );
};

const SectionCard = ({ title, children, icon: Icon }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center gap-3 mb-4">
      <Icon className="w-6 h-6 text-blue-600" />
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

const SadhanaTracker = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [saveStatus, setSaveStatus] = useState('');
  
  const emptyForm = {
    reporting: { status: 'On Time', delayMinutes: 0 },
    body: {
      wakeUpTime: '',
      sleepTime: '',
      dayRestMinutes: '',
      workingHours: '',
      workingDescription: '',
      materialEngagementHours: '',
      materialDescription: ''
    },
    soul: {
      japaRounds: '',
      japaCompletionTime: '',
      readingHours: '',
      readingMaterial: '',
      shravanamHours: '',
      shravanamSource: 'Srila Prabhupada',
      shravanamDescription: '',
      spiritualEngagementHours: '',
      spiritualDescription: '',
      sevaHours: '',
      sevaDescription: ''
    },
    morningProgram: {
      chanting: false,
      sikshatakam: false,
      morningClass: false,
      slokaRecitation: false,
      mangalAarti: {
        guruAshtakam: false,
        narasimhaAarti: false,
        tulsiAarti: false
      }
    },
    notes: ''
  };
  
  const [formData, setFormData] = useState(emptyForm);

  // Load data from localStorage when component mounts or date changes
  useEffect(() => {
    const savedData = localStorage.getItem(`sadhana_${selectedDate}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData({ ...emptyForm, ...parsed });
      } catch (e) {
        console.error('Error loading saved data:', e);
        setFormData(emptyForm);
      }
    } else {
      setFormData(emptyForm);
    }
  }, [selectedDate]);

  // Auto-save to localStorage whenever formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(`sadhana_${selectedDate}`, JSON.stringify(formData));
        setSaveStatus('Saved ✓');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (e) {
        console.error('Error saving data:', e);
        setSaveStatus('Error saving');
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData, selectedDate]);

  const handleInputChange = (section, field, value, subField = null) => {
    if (subField) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: {
            ...prev[section][field],
            [subField]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const handleToggle = (section, field, subField = null) => {
    if (subField) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: {
            ...prev[section][field],
            [subField]: !prev[section][field][subField]
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: !prev[section][field]
        }
      }));
    }
  };

  const calculateSleepScore = () => {
    if (!formData.body?.sleepTime) return 0;
    const sleepTime = new Date(`2000-01-01 ${formData.body.sleepTime}`);
    const time21 = new Date(`2000-01-01 21:00`);
    const time2130 = new Date(`2000-01-01 21:30`);
    const time22 = new Date(`2000-01-01 22:00`);
    const time2230 = new Date(`2000-01-01 22:30`);
    const time23 = new Date(`2000-01-01 23:00`);
    
    if (sleepTime <= time21) return 100;
    if (sleepTime <= time2130) return 80;
    if (sleepTime <= time22) return 60;
    if (sleepTime <= time2230) return 40;
    if (sleepTime <= time23) return 20;
    return 0;
  };

  const calculateWakeScore = () => {
    if (!formData.body?.wakeUpTime) return 0;
    const wakeTime = new Date(`2000-01-01 ${formData.body.wakeUpTime}`);
    const time4 = new Date(`2000-01-01 04:00`);
    const time415 = new Date(`2000-01-01 04:15`);
    const time430 = new Date(`2000-01-01 04:30`);
    const time445 = new Date(`2000-01-01 04:45`);
    const time5 = new Date(`2000-01-01 05:00`);
    
    if (wakeTime <= time4) return 100;
    if (wakeTime <= time415) return 80;
    if (wakeTime <= time430) return 60;
    if (wakeTime <= time445) return 40;
    if (wakeTime <= time5) return 20;
    return 0;
  };

  const calculateDayRestScore = () => {
    const dayRest = parseInt(formData.body.dayRestMinutes) || 0;
    if (dayRest <= 60) return 100;
    if (dayRest <= 90) return 60;
    if (dayRest <= 120) return 20;
    return 0;
  };

  const calculateJapaRoundsScore = () => {
    const japaRounds = parseInt(formData.soul.japaRounds) || 0;
    return japaRounds >= 16 ? 100 : 0;
  };

  const calculateJapaTimeScore = () => {
    if (!formData.soul.japaCompletionTime) return 0;
    const completionTime = new Date(`2000-01-01 ${formData.soul.japaCompletionTime}`);
    const time8 = new Date(`2000-01-01 08:00`);
    const time12 = new Date(`2000-01-01 12:00`);
    const time18 = new Date(`2000-01-01 18:00`);
    const time21 = new Date(`2000-01-01 21:00`);
    
    if (completionTime <= time8) return 100;
    if (completionTime <= time12) return 70;
    if (completionTime <= time18) return 40;
    if (completionTime <= time21) return 20;
    return 0;
  };

  const calculateReadingScore = () => {
    const readingMinutes = (parseFloat(formData.soul.readingHours) || 0) * 60;
    if (readingMinutes >= 60) return 100;
    if (readingMinutes >= 40) return 80;
    if (readingMinutes >= 20) return 30;
    return 0;
  };

  const calculateShravanamScore = () => {
    const shravanamMinutes = (parseFloat(formData.soul.shravanamHours) || 0) * 60;
    if (shravanamMinutes >= 60) return 100;
    if (shravanamMinutes >= 40) return 80;
    if (shravanamMinutes >= 20) return 30;
    return 0;
  };

  const calculateBodyScore = () => {
    const sleepScore = calculateSleepScore();
    const wakeScore = calculateWakeScore();
    const restScore = calculateDayRestScore();
    return Math.round((sleepScore + wakeScore + restScore) / 3);
  };

  const calculateSoulScore = () => {
    const japaRoundsScore = calculateJapaRoundsScore();
    const japaTimeScore = calculateJapaTimeScore();
    const readingScore = calculateReadingScore();
    const shravanamScore = calculateShravanamScore();
    const japaScore = Math.min(japaRoundsScore, japaTimeScore);
    return Math.round((japaScore + readingScore + shravanamScore) / 3);
  };

  const generateShareText = () => {
    const bodyScore = calculateBodyScore();
    const soulScore = calculateSoulScore();
    const avgScore = Math.round((bodyScore + soulScore) / 2);
    
    const text = `🙏 Today's Sadhana Report 🙏

📊 SCORES:
Body Score: ${bodyScore}%
Soul Score: ${soulScore}%
Overall: ${avgScore}%

⏰ TIMING:
Reporting: ${formData.reporting.status}${formData.reporting.status === 'Late' ? ` (${formData.reporting.delayMinutes} mins)` : ''}
Sleep: ${formData.body.sleepTime || 'Not entered'} | Wake: ${formData.body.wakeUpTime || 'Not entered'}
Day Rest: ${formData.body.dayRestMinutes || 0} mins

🕉️ SPIRITUAL PRACTICES:
Japa: ${formData.soul.japaRounds || 0} rounds (completed: ${formData.soul.japaCompletionTime || 'Not entered'})
Reading: ${formData.soul.readingHours || 0}h - ${formData.soul.readingMaterial || 'Not specified'}
Shravanam: ${formData.soul.shravanamHours || 0}h - ${formData.soul.shravanamSource}
${formData.soul.shravanamDescription ? `(${formData.soul.shravanamDescription})` : ''}

🎯 ENGAGEMENT:
Seva: ${formData.soul.sevaHours || 0}h - ${formData.soul.sevaDescription || 'Not specified'}
Spiritual: ${formData.soul.spiritualEngagementHours || 0}h - ${formData.soul.spiritualDescription || 'Not specified'}
Material: ${formData.body.materialEngagementHours || 0}h - ${formData.body.materialDescription || 'Not specified'}
Work: ${formData.body.workingHours || 0}h - ${formData.body.workingDescription || 'Not specified'}

🌅 MORNING PROGRAM:
Chanting: ${formData.morningProgram.chanting ? '✅' : '❌'}
Sikshatakam: ${formData.morningProgram.sikshatakam ? '✅' : '❌'}
Morning Class: ${formData.morningProgram.morningClass ? '✅' : '❌'}
Sloka Recitation: ${formData.morningProgram.slokaRecitation ? '✅' : '❌'}
Guru Ashtakam: ${formData.morningProgram.mangalAarti.guruAshtakam ? '✅' : '❌'}
Narasimha Aarti: ${formData.morningProgram.mangalAarti.narasimhaAarti ? '✅' : '❌'}
Tulsi Aarti: ${formData.morningProgram.mangalAarti.tulsiAarti ? '✅' : '❌'}

Hare Krishna! 🙏`;

    navigator.clipboard.writeText(text).then(() => {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    }).catch(() => {
      alert('Failed to copy to clipboard. Please try again.');
    });
  };

  const bodyScore = calculateBodyScore();
  const soulScore = calculateSoulScore();

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Sadhana Card</h1>
          <p className="text-gray-600">Track your spiritual practices and devotional activities</p>
          {saveStatus && <p className="text-sm text-green-600 mt-1">{saveStatus}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-md px-2 py-1"
            />
          </div>
          {["overview","reporting","body","soul","morning"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard 
              title="Body Score" 
              value={`${bodyScore}%`} 
              icon={Briefcase} 
              color={bodyScore >= 80 ? 'green' : bodyScore >= 60 ? 'amber' : 'red'} 
              subtitle="Sleep, Wake, Rest"
              score={bodyScore}
            />
            <StatCard 
              title="Soul Score" 
              value={`${soulScore}%`} 
              icon={Heart} 
              color={soulScore >= 80 ? 'green' : soulScore >= 60 ? 'amber' : 'red'} 
              subtitle="Japa, Reading, Shravanam"
              score={soulScore}
            />
            <StatCard 
              title="Overall" 
              value={`${Math.round((bodyScore + soulScore) / 2)}%`} 
              icon={Star} 
              color={Math.round((bodyScore + soulScore) / 2) >= 80 ? 'green' : Math.round((bodyScore + soulScore) / 2) >= 60 ? 'amber' : 'red'} 
              subtitle="Combined Score"
              score={Math.round((bodyScore + soulScore) / 2)}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
              title="Japa Rounds" 
              value={formData.soul.japaRounds || '0'} 
              icon={Heart} 
              color="rose" 
              subtitle={`At ${formData.soul.japaCompletionTime || 'Not entered'}`} 
            />
            <StatCard 
              title="Reading" 
              value={`${formData.soul.readingHours || '0'}h`} 
              icon={BookOpen} 
              color="blue" 
              subtitle={formData.soul.readingMaterial || 'Not specified'} 
            />
            <StatCard 
              title="Shravanam" 
              value={`${formData.soul.shravanamHours || '0'}h`} 
              icon={Music} 
              color="purple" 
              subtitle={formData.soul.shravanamSource} 
            />
            <StatCard 
              title="Seva" 
              value={`${formData.soul.sevaHours || '0'}h`} 
              icon={Users} 
              color="teal" 
              subtitle={formData.soul.sevaDescription || "Service"} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SectionCard title="Body Score Breakdown" icon={Briefcase}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sleep Time ({formData.body.sleepTime || 'Not set'}):</span>
                  <span className="font-medium text-blue-600">{calculateSleepScore()}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Wake Time ({formData.body.wakeUpTime || 'Not set'}):</span>
                  <span className="font-medium text-blue-600">{calculateWakeScore()}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Day Rest ({formData.body.dayRestMinutes || 0} mins):</span>
                  <span className="font-medium text-blue-600">{calculateDayRestScore()}/100</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Body Score Average:</span>
                  <span className={`${bodyScore >= 80 ? 'text-green-600' : bodyScore >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                    {bodyScore}%
                  </span>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Soul Score Breakdown" icon={Heart}>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Japa Rounds ({formData.soul.japaRounds || 0}):</span>
                  <span className="font-medium text-blue-600">{calculateJapaRoundsScore()}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Japa Time ({formData.soul.japaCompletionTime || 'Not set'}):</span>
                  <span className="font-medium text-blue-600">{calculateJapaTimeScore()}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Reading ({formData.soul.readingHours || 0}h):</span>
                  <span className="font-medium text-blue-600">{calculateReadingScore()}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Shravanam ({formData.soul.shravanamHours || 0}h):</span>
                  <span className="font-medium text-blue-600">{calculateShravanamScore()}/100</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Soul Score Average:</span>
                  <span className={`${soulScore >= 80 ? 'text-green-600' : soulScore >= 60 ? 'text-orange-600' : 'text-red-600'}`}>
                    {soulScore}%
                  </span>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="text-center">
            <button 
              onClick={generateShareText}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
            >
              <Share2 className="w-5 h-5" />
              Share on WhatsApp
            </button>
          </div>
        </>
      )}

      {/* Reporting Tab */}
      {activeTab === 'reporting' && (
        <SectionCard title="Reporting" icon={Clock}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reporting Status</label>
                <select 
                  value={formData.reporting.status} 
                  onChange={(e) => handleInputChange('reporting', 'status', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="On Time">On Time</option>
                  <option value="Late">Late</option>
                </select>
              </div>
              {formData.reporting.status === 'Late' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Delay (minutes)</label>
                  <input 
                    type="number" 
                    value={formData.reporting.delayMinutes} 
                    onChange={(e) => handleInputChange('reporting', 'delayMinutes', e.target.value)}
                    className="w-full p-2 border rounded-lg" 
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      )}

      {/* Body Tab */}
      {activeTab === 'body' && (
        <SectionCard title="BODY - Physical Practices" icon={Briefcase}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Wake Up Time</label>
                <input 
                  type="time" 
                  value={formData.body.wakeUpTime} 
                  onChange={(e) => handleInputChange('body', 'wakeUpTime', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sleep Time</label>
                <input 
                  type="time" 
                  value={formData.body.sleepTime} 
                  onChange={(e) => handleInputChange('body', 'sleepTime', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Day Rest (minutes)</label>
                <input 
                  type="number" 
                  value={formData.body.dayRestMinutes} 
                  onChange={(e) => handleInputChange('body', 'dayRestMinutes', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Working Hours</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={formData.body.workingHours} 
                  onChange={(e) => handleInputChange('body', 'workingHours', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                  min="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Work Description</label>
                <input 
                  type="text" 
                  value={formData.body.workingDescription} 
                  onChange={(e) => handleInputChange('body', 'workingDescription', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                  placeholder="Job, study, projects..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Material Engagement (hours)</label>
                <input 
                  type="number" 
                  step="0.5"
                  value={formData.body.materialEngagementHours} 
                  onChange={(e) => handleInputChange('body', 'materialEngagementHours', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Material Description</label>
                <input 
                  type="text" 
                  value={formData.body.materialDescription} 
                  onChange={(e) => handleInputChange('body', 'materialDescription', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                  placeholder="Entertainment, social media..."
                />
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Soul Tab */}
      {activeTab === 'soul' && (
        <SectionCard title="SOUL - Spiritual Practices" icon={Heart}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Japa Rounds</label>
                <input 
                  type="number" 
                  value={formData.soul.japaRounds} 
                  onChange={(e) => handleInputChange('soul', 'japaRounds', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Japa Completion Time</label>
                <input 
                  type="time" 
                  value={formData.soul.japaCompletionTime} 
                  onChange={(e) => handleInputChange('soul', 'japaCompletionTime', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reading Time (hours)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.soul.readingHours} 
                  onChange={(e) => handleInputChange('soul', 'readingHours', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reading Material</label>
                <input 
                  type="text" 
                  value={formData.soul.readingMaterial} 
                  onChange={(e) => handleInputChange('soul', 'readingMaterial', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shravanam Time (hours)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.soul.shravanamHours} 
                  onChange={(e) => handleInputChange('soul', 'shravanamHours', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shravanam Source</label>
                <select 
                  value={formData.soul.shravanamSource} 
                  onChange={(e) => handleInputChange('soul', 'shravanamSource', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="Srila Prabhupada">Srila Prabhupada</option>
                  <option value="Guru Maharaj">Guru Maharaj</option>
                  <option value="HG RSP">HG RSP</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Shravanam Description</label>
                <input 
                  type="text" 
                  value={formData.soul.shravanamDescription} 
                  onChange={(e) => handleInputChange('soul', 'shravanamDescription', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                  placeholder="What you heard about..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Seva Time (hours)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.soul.sevaHours} 
                  onChange={(e) => handleInputChange('soul', 'sevaHours', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Seva Description</label>
                <input 
                  type="text" 
                  value={formData.soul.sevaDescription} 
                  onChange={(e) => handleInputChange('soul', 'sevaDescription', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                  placeholder="Type of service..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Spiritual Engagement (hours)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={formData.soul.spiritualEngagementHours} 
                  onChange={(e) => handleInputChange('soul', 'spiritualEngagementHours', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Spiritual Description</label>
                <input 
                  type="text" 
                  value={formData.soul.spiritualDescription} 
                  onChange={(e) => handleInputChange('soul', 'spiritualDescription', e.target.value)}
                  className="w-full p-2 border rounded-lg" 
                  placeholder="Meditation, kirtan, etc..."
                />
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Morning Program Tab */}
      {activeTab === 'morning' && (
        <SectionCard title="Morning Program" icon={Sun}>
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Basic Activities</h3>
              {[
                {key: 'chanting', label: 'Chanting'},
                {key: 'sikshatakam', label: 'Sikshatakam'},
                {key: 'morningClass', label: 'Morning Class'},
                {key: 'slokaRecitation', label: 'Sloka Recitation'}
              ].map(({key, label}) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.morningProgram[key]} 
                      onChange={() => handleToggle('morningProgram', key)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      formData.morningProgram[key] ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        formData.morningProgram[key] ? 'translate-x-5' : 'translate-x-0'
                      } mt-0.5`}></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Mangal Aarti</h3>
              {[
                {key: 'guruAshtakam', label: 'Guru Ashtakam'},
                {key: 'narasimhaAarti', label: 'Narasimha Aarti'},
                {key: 'tulsiAarti', label: 'Tulsi Aarti'}
              ].map(({key, label}) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded-lg ml-4">
                  <span className="font-medium">{label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.morningProgram.mangalAarti[key]} 
                      onChange={() => handleToggle('morningProgram', 'mangalAarti', key)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      formData.morningProgram.mangalAarti[key] ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        formData.morningProgram.mangalAarti[key] ? 'translate-x-5' : 'translate-x-0'
                      } mt-0.5`}></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(SadhanaTracker));