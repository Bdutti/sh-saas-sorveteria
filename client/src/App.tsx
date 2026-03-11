import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Clientes from "./pages/Clientes";
import Vendas from "./pages/Vendas";
import Caixa from "./pages/Caixa";
import Relatorios from "./pages/Relatorios";
import Backup from "./pages/Backup";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/produtos" component={Produtos} />
      <Route path="/clientes" component={Clientes} />
      <Route path="/vendas" component={Vendas} />
      <Route path="/caixa" component={Caixa} />
      <Route path="/relatorios" component={Relatorios} />
      <Route path="/backup" component={Backup} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - Light mode theme for professional ERP application
// - Color palette: Professional blue + white + accents

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
