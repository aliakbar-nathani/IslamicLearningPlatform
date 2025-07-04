import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function DevLogin() {
  const { login } = useAuth();
  
  const handleInstructorLogin = async () => {
    try {
      // This is just for development - in production, use real authentication
      await login('instructor@example.com', 'password');
      
      // Manually set the user with instructor role
      const devInstructor = {
        id: 'dev-instructor-123',
        email: 'instructor@example.com',
        name: 'Test Instructor',
        role: 'instructor' as const,
        provider: 'email' as const
      };
      
      localStorage.setItem('user', JSON.stringify(devInstructor));
      window.location.href = '/instructor';
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Only show in development
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        variant="outline" 
        onClick={handleInstructorLogin}
        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      >
        Dev: Login as Instructor
      </Button>
    </div>
  );
}
