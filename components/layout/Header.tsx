'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, User, Wallet, Settings, LogOut, TrendingUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function Header() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/auth/signin';
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">CryptoTrade</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard">
                <Button
                  variant={pathname === '/dashboard' ? 'secondary' : 'ghost'}
                  size="sm"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/markets">
                <Button
                  variant={pathname?.startsWith('/markets') ? 'secondary' : 'ghost'}
                  size="sm"
                >
                  Markets
                </Button>
              </Link>
              <Link href="/trade/BTC">
                <Button
                  variant={pathname?.startsWith('/trade') ? 'secondary' : 'ghost'}
                  size="sm"
                >
                  Trade
                </Button>
              </Link>
              <Link href="/wallet">
                <Button
                  variant={pathname?.startsWith('/wallet') ? 'secondary' : 'ghost'}
                  size="sm"
                >
                  Wallet
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button
                  variant={pathname === '/portfolio' ? 'secondary' : 'ghost'}
                  size="sm"
                >
                  Portfolio
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>

            <Link href="/wallet">
              <Button variant="outline" size="sm" className="gap-2">
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">Wallet</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile" className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
