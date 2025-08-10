import React, { useState } from 'react';
import './LibraryDashboard.css';
import './dashboard.css';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  TrendingUp, 
  Search, 
  Plus, 
  Settings,
  Bell,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Book,
  UserCheck,
  DollarSign,
  Filter
} from 'lucide-react';

const LibraryDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const stats = {
    totalBooks: 15420,
    totalMembers: 2847,
    booksIssued: 3256,
    overdueBooks: 42,
    newMembers: 127,
    revenue: 25680
  };

  const recentTransactions = [
    { id: 1, type: 'Issue', book: 'The Great Gatsby', member: 'John Doe', date: '2024-08-09', status: 'active' },
    { id: 2, type: 'Return', book: '1984', member: 'Jane Smith', date: '2024-08-08', status: 'completed' },
    { id: 3, type: 'Issue', book: 'Pride and Prejudice', member: 'Mike Johnson', date: '2024-08-07', status: 'active' },
    { id: 4, type: 'Return', book: 'To Kill a Mockingbird', member: 'Sarah Wilson', date: '2024-08-06', status: 'overdue' }
  ];

  const popularBooks = [
    { id: 1, title: 'The Midnight Library', author: 'Matt Haig', issued: 45, available: 3 },
    { id: 2, title: 'Atomic Habits', author: 'James Clear', issued: 38, available: 7 },
    { id: 3, title: 'The Silent Patient', author: 'Alex Michaelides', issued: 32, available: 2 },
    { id: 4, title: 'Educated', author: 'Tara Westover', issued: 29, available: 5 }
  ];

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="card p-6 rounded-xl hover:shadow-xl transition-all duration-300 border-l-4" style={{borderLeftColor: color}}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted text-sm font-medium">{title}</p>
          <p className="text-3xl title mt-2">{value.toLocaleString()}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp size={16} className="mr-1" />
              {change > 0 ? '+' : ''}{change}% this month
            </p>
          )}
        </div>
        <div className="p-4 rounded-full" style={{backgroundColor: `${color}20`}}>
          <Icon size={32} color={color} />
        </div>
      </div>
    </div>
  );

  const TransactionRow = ({ transaction }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${
          transaction.type === 'Issue' ? 'bg-blue-100' : 'bg-green-100'
        }`}>
          <Book size={20} color={transaction.type === 'Issue' ? '#3b82f6' : '#10b981'} />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{transaction.book}</p>
          <p className="text-sm text-gray-600">{transaction.member}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">{transaction.date}</p>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          transaction.status === 'active' ? 'bg-blue-100 text-blue-800' :
          transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {transaction.status}
        </span>
      </div>
    </div>
  );

  return (
    <div className="dashboard min-h-screen">
      {/* Header */}
      <header className="dashboard-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="dashboard-brand-accent" size={32} />
                <h1 className="text-2xl font-bold dashboard-brand">LibraryPro</h1>
              </div>
              <nav className="hidden md:flex space-x-8 ml-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'overview' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('books')}
                  className={`px-3 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'books' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  Books
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`px-3 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'members' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  Members
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`px-3 py-2 rounded-md font-medium transition-colors ${
                    activeTab === 'transactions' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  Transactions
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 pr-4 py-2"
                />
              </div>
              <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <Settings size={20} />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <span className="text-gray-700 font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard 
                icon={BookOpen} 
                title="Total Books" 
                value={stats.totalBooks} 
                change={5.2} 
                color="#3b82f6"
              />
              <StatCard 
                icon={Users} 
                title="Total Members" 
                value={stats.totalMembers} 
                change={12.1} 
                color="#10b981"
              />
              <StatCard 
                icon={Calendar} 
                title="Books Issued" 
                value={stats.booksIssued} 
                change={8.7} 
                color="#f59e0b"
              />
              <StatCard 
                icon={AlertCircle} 
                title="Overdue Books" 
                value={stats.overdueBooks} 
                change={-2.1} 
                color="#ef4444"
              />
              <StatCard 
                icon={UserCheck} 
                title="New Members" 
                value={stats.newMembers} 
                change={15.3} 
                color="#8b5cf6"
              />
              <StatCard 
                icon={DollarSign} 
                title="Revenue" 
                value={stats.revenue} 
                change={7.8} 
                color="#06b6d4"
              />
            </div>

            {/* Charts and Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Transactions */}
              <div className="panel p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl title">Recent Transactions</h3>
                  <button className="btn-primary px-4 py-2 rounded-md">View All</button>
                </div>
                <div className="space-y-4">
                  {recentTransactions.map(transaction => (
                    <TransactionRow key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              </div>

              {/* Popular Books */}
              <div className="panel p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl title">Popular Books</h3>
                  <button className="btn-primary px-4 py-2 rounded-md">View All</button>
                </div>
                <div className="space-y-4">
                  {popularBooks.map((book, index) => (
                    <div key={book.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{book.title}</p>
                          <p className="text-sm text-gray-600">{book.author}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-indigo-600">{book.issued} issued</p>
                        <p className="text-xs text-gray-500">{book.available} available</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="panel p-6">
              <h3 className="text-xl title mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button className="btn-primary px-6 py-3 rounded-lg flex items-center justify-center space-x-2">
                  <Plus size={20} />
                  <span>Add Book</span>
                </button>
                <button className="btn-primary px-6 py-3 rounded-lg flex items-center justify-center space-x-2" style={{background: '#059669'}}>
                  <UserCheck size={20} />
                  <span>Add Member</span>
                </button>
                <button className="btn-primary px-6 py-3 rounded-lg flex items-center justify-center space-x-2" style={{background: '#2563eb'}}>
                  <Book size={20} />
                  <span>Issue Book</span>
                </button>
                <button className="btn-primary px-6 py-3 rounded-lg flex items-center justify-center space-x-2" style={{background: '#ea580c'}}>
                  <CheckCircle size={20} />
                  <span>Return Book</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl title">Book Management</h2>
              <div className="flex space-x-4">
                <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  <Filter size={18} />
                  <span className="ml-2">Filter</span>
                </button>
                <button className="btn-primary px-4 py-2 rounded-lg flex items-center">
                  <Plus size={18} />
                  <span className="ml-2">Add Book</span>
                </button>
              </div>
            </div>
            <div className="panel p-6">
              <div className="text-center py-12">
                <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl title mb-2">Book Management Interface</h3>
                <p className="text-muted">Detailed book management features would be implemented here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl title">Member Management</h2>
              <button className="btn-primary px-4 py-2 rounded-lg flex items-center">
                <Plus size={18} />
                <span className="ml-2">Add Member</span>
              </button>
            </div>
            <div className="panel p-6">
              <div className="text-center py-12">
                <Users size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl title mb-2">Member Management Interface</h3>
                <p className="text-muted">Detailed member management features would be implemented here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl title">Transaction History</h2>
              <div className="flex space-x-4">
                <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  <Filter size={18} />
                  <span className="ml-2">Filter</span>
                </button>
                <button className="btn-primary px-4 py-2 rounded-lg flex items-center" style={{background: '#2563eb'}}>
                  <Book size={18} />
                  <span className="ml-2">Issue Book</span>
                </button>
              </div>
            </div>
            <div className="panel p-6">
              <div className="space-y-4">
                {recentTransactions.concat(recentTransactions).map((transaction, index) => (
                  <TransactionRow key={`${transaction.id}-${index}`} transaction={transaction} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LibraryDashboard;