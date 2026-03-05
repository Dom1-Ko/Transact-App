import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription, 
} from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
import { Input } from './ui/input';
import { authFormSchema } from '@/lib/utils';
import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod';

// since here we want to use all the fiels since filling the form. the will be not conflick like when sending data with sign-in form
const formSchema = authFormSchema("sign-up")

interface FormInputFieldProps {
    control: Control<z.infer<typeof formSchema>>, //since we only need the control
    name: FieldPath<z.infer<typeof formSchema>>, // so that it knows the type of field required for this field, since it changes for each field (i.e needs to be dynamic)
    label: string,
    placeholder: string
}

const FormInputField = ( { control, name, label, placeholder }: FormInputFieldProps ) => {
  return (
    <FormField
        control={control} // Passed explicitly, or consumed implicitly by FormField
        name= {name}
        render={({ field }) => (
            <div className="form-item">
                <FormLabel className="form-label">
                    {label}
                </FormLabel>
                <div className="flex w-full flex-col">
                    <FormControl>
                        <Input placeholder={placeholder} className="input-class" type={ name === "password" ? "password" : "text"} {...field} />
                    </FormControl>
                    <FormMessage className="form-message mt-2" />
                </div>
            </div>
        )}
    />
  )
}

export default FormInputField


// for the input tag we have if stmt cuz we need to assign the type of data being input by user, password is sensitive so need to use 'password'