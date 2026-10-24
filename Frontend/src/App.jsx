import { RouterProvider } from "react-router";
import { router } from "./appRouter"; 
import { AuthProvider } from "./features/auth/auth.context";
import { InterviewProvider } from "./features/interview/Interview.context";



function App(){
  return (<>
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router}/>
      </InterviewProvider>
    </AuthProvider>
  </>)
}

export default App
