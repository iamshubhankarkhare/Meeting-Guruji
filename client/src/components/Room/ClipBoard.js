import React, { useState } from 'react';
import {
  Flex,
  Text,
  AlertDialog,
  AlertDialogBody,
  Button,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useClipboard,
} from '@chakra-ui/react';

function ClipBoard({ url, currentUser }) {
  const { hasCopied, onCopy } = useClipboard(url);

  const [isOpen, setIsOpen] = React.useState(true);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <Text fontSize="xl">Your meeting's ready</Text>
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text my="4" fontSize="lg">
                Share this link with others you want in the meeting
              </Text>
              <Flex my={4} bg="gray.200" justify="space-between" align="center">
                <Text mx="4" fontWeight="bold">
                  {url.substring(0, 30)}...
                </Text>
                <Button bg="none" onClick={onCopy} ml={2}>
                  {hasCopied ? 'Copied!' : 'Copy'}
                </Button>
              </Flex>
              <Text as="i" color="gray.700">
                Joined as {currentUser.email}
              </Text>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default ClipBoard;
