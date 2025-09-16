import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Store,
  Briefcase,
  Megaphone,
  Users,
  Ticket,
  HelpCircle,
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  Filter
} from 'lucide-react';
import './AdminDashBoard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    stores: { platinum: 0, gold: 0, diamond: 0, total: 0 },
    jobs: 0,
    ads: 0,
    users: 0,
    coupons: 0,
    enquiries: { total: 0, today: 0, older: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiryFilter, setEnquiryFilter] = useState('all');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          storesRes, 
          jobsRes, 
          adsRes, 
          usersRes,
          couponsRes,
          enquiriesRes
        ] = await Promise.all([
          axios.get('http://localhost:4000/api/stores'),
          axios.get('http://localhost:4000/api/jobs'),
          axios.get('http://localhost:4000/api/ads'),
          axios.get('http://localhost:4000/api/users'),
          axios.get('http://localhost:4000/api/coupons'),
          axios.get('http://localhost:4000/api/enquiries')
        ]);

        // Count store plans
        const platinumCount = storesRes.data.filter(store => store.plan === 'platinum').length;
        const goldCount = storesRes.data.filter(store => store.plan === 'gold').length;
        const diamondCount = storesRes.data.filter(store => store.plan === 'diamond').length;

        // Calculate today's and older enquiries
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const enquiriesData = enquiriesRes.data;
        const todayEnquiries = enquiriesData.filter(enquiry => {
          const enquiryDate = new Date(enquiry.createdAt);
          return enquiryDate >= today;
        }).length;
        
        const olderEnquiries = enquiriesData.length - todayEnquiries;

        setStats({
          stores: {
            platinum: platinumCount,
            gold: goldCount,
            diamond: diamondCount,
            total: storesRes.data.length
          },
          jobs: jobsRes.data.length,
          ads: adsRes.data.length,
          users: usersRes.data.length,
          coupons: couponsRes.data.length,
          enquiries: {
            total: enquiriesData.length,
            today: todayEnquiries,
            older: olderEnquiries
          }
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch statistics. Please check your API endpoints.');
        setLoading(false);
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  const getEnquiryCount = () => {
    switch(enquiryFilter) {
      case 'today':
        return stats.enquiries.today;
      case 'older':
        return stats.enquiries.older;
      default:
        return stats.enquiries.total;
    }
  };

  const getEnquiryDescription = () => {
    switch(enquiryFilter) {
      case 'today':
        return "Today's enquiries";
      case 'older':
        return "Older enquiries";
      default:
        return "Total enquiries";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <Activity className="spinner-icon" size={32} />
          </div>
          <div className="loading-text">
            <h3>Loading Dashboard</h3>
            <p>Fetching real-time analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">
            <HelpCircle size={64} />
          </div>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            <TrendingUp size={20} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Real-time business analytics and insights</p>
        </div>
        <div className="header-decoration"></div>
      </div>
      
      <div className="stats-grid">
        {/* Stores Card */}
        <div className="stat-card stores-card">
          <div className="card-header">
            <div className="card-icon stores-icon">
              <Store size={28} />
            </div>
            <div className="card-trend">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="card-content">
            <h2>Stores</h2>
            <div className="stat-number">{stats.stores.total}</div>
            <div className="stat-subtitle">Active store partners</div>
            
            <div className="plan-breakdown">
              <div className="plan-item">
                <div className="plan-indicator platinum"></div>
                <span className="plan-label">Platinum</span>
                <span className="plan-count">{stats.stores.platinum}</span>
              </div>
              <div className="plan-item">
                <div className="plan-indicator diamond"></div>
                <span className="plan-label">Diamond</span>
                <span className="plan-count">{stats.stores.diamond}</span>
              </div>
              <div className="plan-item">
                <div className="plan-indicator gold"></div>
                <span className="plan-label">Gold</span>
                <span className="plan-count">{stats.stores.gold}</span>
              </div>
            </div>
          </div>
          <div className="card-overlay stores-overlay"></div>
        </div>

        {/* Jobs Card */}
        <div className="stat-card jobs-card">
          <div className="card-header">
            <div className="card-icon jobs-icon">
              <Briefcase size={28} />
            </div>
            <div className="card-trend">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="card-content">
            <h2>Jobs</h2>
            <div className="stat-number">{stats.jobs}</div>
            <div className="stat-subtitle">Active job listings</div>
          </div>
          <div className="card-overlay jobs-overlay"></div>
        </div>

        {/* Ads Card */}
        <div className="stat-card ads-card">
          <div className="card-header">
            <div className="card-icon ads-icon">
              <Megaphone size={28} />
            </div>
            <div className="card-trend">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="card-content">
            <h2>Advertisements</h2>
            <div className="stat-number">{stats.ads}</div>
            <div className="stat-subtitle">Running campaigns</div>
          </div>
          <div className="card-overlay ads-overlay"></div>
        </div>

        {/* Users Card */}
        <div className="stat-card users-card">
          <div className="card-header">
            <div className="card-icon users-icon">
              <Users size={28} />
            </div>
            <div className="card-trend">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="card-content">
            <h2>Users</h2>
            <div className="stat-number">{stats.users.toLocaleString()}</div>
            <div className="stat-subtitle">Registered members</div>
          </div>
          <div className="card-overlay users-overlay"></div>
        </div>

        {/* Coupons Card */}
        <div className="stat-card coupons-card">
          <div className="card-header">
            <div className="card-icon coupons-icon">
              <Ticket size={28} />
            </div>
            <div className="card-trend">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="card-content">
            <h2>Coupons</h2>
            <div className="stat-number">{stats.coupons}</div>
            <div className="stat-subtitle">Active promotions</div>
          </div>
          <div className="card-overlay coupons-overlay"></div>
        </div>

        {/* Enquiries Card */}
        <div className="stat-card enquiries-card">
          <div className="card-header">
            <div className="card-icon enquiries-icon">
              <HelpCircle size={28} />
            </div>
            <div className="card-trend">
              <Filter size={16} />
            </div>
          </div>
          <div className="card-content">
            <h2>Enquiries</h2>
            <div className="stat-number">{getEnquiryCount()}</div>
            <div className="stat-subtitle">{getEnquiryDescription()}</div>
            
            <div className="filter-controls">
              <button 
                className={`filter-btn ${enquiryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setEnquiryFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${enquiryFilter === 'today' ? 'active' : ''}`}
                onClick={() => setEnquiryFilter('today')}
              >
                <Calendar size={14} />
                Today
              </button>
              <button 
                className={`filter-btn ${enquiryFilter === 'older' ? 'active' : ''}`}
                onClick={() => setEnquiryFilter('older')}
              >
                <Clock size={14} />
                Older
              </button>
            </div>
            
            <div className="enquiry-summary">
              <div className="summary-item">
                <span className="summary-label">Today:</span>
                <span className="summary-value">{stats.enquiries.today}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Previous:</span>
                <span className="summary-value">{stats.enquiries.older}</span>
              </div>
            </div>
          </div>
          <div className="card-overlay enquiries-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;