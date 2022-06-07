import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import RequestAccess from "../../components/requestAccess";
import PunkCard from "../../components/punkCard";
import { usePlatziPunkData } from "../../hooks/usePlatziPunksData";
import { useParams } from "react-router-dom";
import Loading from "../../components/loading";
import usePlatziPunks from "../../hooks/usePlatziPunks";
import { useState } from "react";

const Punk = () => {
  const { active, account, library } = useWeb3React();
  const { tokenId } = useParams();
  const platziPunks = usePlatziPunks();
  const { loading, punk, getPunk } = usePlatziPunkData(tokenId);
  const toast = useToast();
  const [isTransfering, setIsTransfering] = useState(false);

  if (!active) return <RequestAccess />;

  if (loading) return <Loading />;

  const transferNFT = async () => {
    if (!platziPunks) return;
    setIsTransfering(true);

    const address = prompt('Ingresa la dirección del usuario al que quieres transferir el NFT: ');

    const isAddress = await library.utils.isAddress(address);

    if (!isAddress) {
      toast({
        title: 'Dirección inválida',
        description: 'La dirección ingresada no es válida',
        status: 'error'
      });
      setIsTransfering(false)
    } else {
      platziPunks.methods
        .safeTransferFrom(punk.owner, address, punk.tokenId)
        .send({
          from: account,
        })
        .on("error", () => {
          setIsTransfering(false);
        })
        .on("transactionHash", (txHash) => {
          toast({
            title: "Transacción enviada",
            description: txHash,
            status: "info",
          });
        })
        .on("receipt", () => {
          setIsTransfering(false);
          toast({
            title: "Transacción confirmada",
            description: `El punk ahora pertenece a ${address}`,
            status: "success",
          });
          getPunk();
        });
    }


  }

  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack>
        <PunkCard
          mx={{
            base: "auto",
            md: 0,
          }}
          name={punk.name}
          image={punk.image}
        />
        {account === punk.owner && <Button disabled={account !== punk.owner} isLoading={isTransfering} onClick={transferNFT} colorScheme="green">Transferir
        </Button>}
      </Stack>
      <Stack width="100%" spacing={5}>
        <Heading>{punk.name}</Heading>
        <Text fontSize="xl">{punk.description}</Text>
        <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme="green">
            {punk.dna}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme="green">
            {punk.owner}
          </Tag>
        </Text>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Atributo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(punk.attributes).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Tag>{value}</Tag>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
};

export default Punk;