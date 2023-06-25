import { ScrollView, View } from 'react-native';
import { Title } from '../../components/Texts';
import { useState } from 'react';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import useToast from '../../hooks/useToast';
import { AnonymousProfileBlurb } from './AnonymousProfileBlurb';
import Input from '../../components/forms/Input';
import { trpc } from '../../libs/trpc';

export function IncompleteProfile() {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = trpc.useContext();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess() {
      utils.user.getProfile.refetch();
    },
  });

  const onSubmit = async () => {
    if (!firstName) {
      toast('You need to enter a first name');
      return;
    }
    if (!lastName) {
      toast('You need to enter a last name');
      return;
    }
    if (!email) {
      toast('You need to enter an e-mail');
      return;
    }
    setIsSubmitting(true);
    await updateProfile.mutateAsync({ firstName, lastName, email });
    setIsSubmitting(false);
  };

  return (
    <ScrollView style={{ backgroundColor: Colors.light.background, padding: 16 }}>
      <AnonymousProfileBlurb />
      <View style={{ marginTop: 16 }}>
        <Title>First name</Title>
      </View>
      <Input value={firstName} onChangeText={setFirstName} />
      <View style={{ marginTop: 8 }}>
        <Title>Last name</Title>
      </View>
      <Input value={lastName} onChangeText={setLastName} />

      <View style={{ marginTop: 8 }}>
        <Title>E-mail</Title>
      </View>
      <Input
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <View style={{ marginTop: 16 }}>
        <Button disabled={isSubmitting} loading={isSubmitting} onPress={onSubmit}>
          Complete profile
        </Button>
      </View>
    </ScrollView>
  );
}
